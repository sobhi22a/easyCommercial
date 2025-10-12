const tabXx_bonRoute = require("../../models/tabXx_bonRoute");
const tabTiers = require("../../models/tabTiers");
const regionNoFar = [
  1000236, 1000136, 1001052, 1001053, 1001663, 1000141, 1001564, 1000746, 1000239, 1000951, 1000240, 1001568, 1000235, 1001563,
  1001763, 1001565, 1001567, 1001566, 1000440, 1000138, 1001257, 1000442,
];

const regionFar = [
  1001358, 1000233, 1000033, 1000645, 1000544, 1000644, 1000848, 1000849, 1000949, 1000748, 1000952, 1001054, 1000950, 1000747,
  1000953, 1001056, 1001057, 1001059, 1001458, 1001461, 1001562, 1001764, 1001460, 1001561, 1001459, 1001865, 1001866, 1001867,
  1001964,
];

module.exports = {
  listeLivreur: (req, res) => {
    tabTiers.listeLivreur((reponse) => {
      res.send(reponse);
    });
  },
  calculePrimeLivreurNew: async (req, res) => {
    const { dateA, dateB, id_livreur } = req.body;

    // Normalize dates
    const livreurId = id_livreur?.split("_")[0] || null;

    if (!livreurId) {
      return res.status(400).send({ error: "Invalid livreur ID" });
    }

    const results = await tabXx_bonRoute.FindBonRouteByShipperAndDate(parseInt(livreurId), dateA, dateB);
    if (results.length === 0) {
      return res.status(200).send({
        success: true,
        data: { smc: 0, primeClient: 0, Collisage: 0, primeMoisColis: 0, chiffre: 0, primeMoisRecou: 0, totalNumber: 0 },
      });
    }

    const someClients = await numberOfClients(results);
    if (someClients === false) return res.status(400).send({ success: false, message: "Invalid region data" });

    let Collisage = await numberOfPackages(results);

    const chiffre = await getChiffreRecouverement(livreurId, dateA, dateB);

    // Calculate primes
    const primeMoisRecou = chiffre.PRIMEAMT;
    const primeClient = (someClients || 0) * 50 || 0;
    const primeMoisColis = (Collisage[0].NBRCOLIS || 0) * 2 || 0;
    const totalNumber = primeMoisRecou + primeClient + primeMoisColis;

    let resJson = {
      smc: someClients || 0,
      primeClient,
      Collisage: Collisage[0].NBRCOLIS || 0,
      primeMoisColis,
      chiffre: chiffre.AMT || 0,
      primeMoisRecou,
      totalNumber,
    };

    res.status(200).send({ success: true, data: resJson });
  },
};
async function GetIsFarRegion(regionId) {
  const regions = parseRegions(regionId);
  const isvalid = validateRegionsExist(regions);
  if (!isvalid) return false;
  const results = calculateRegionResults(regions);

  return applyBusinessLogic(regions.length, results);
}

function parseRegions(regionId) {
  if (!regionId) {
    return [0];
  }
  const hasComma = regionId.includes(",");
  if (hasComma) {
    const regions = regionId.split(",").map((id) => {
      const parsed = parseInt(id.trim());
      if (isNaN(parsed)) throw new Error(`ID de région invalide: ${id}`);
      return parsed;
    });
    return regions;
  } else {
    const parsed = parseInt(regionId.trim());
    if (isNaN(parsed)) throw new Error(`ID de région invalide: ${regionId}`);
    return [parsed];
  }
}

function validateRegionsExist(regions) {
  regions.forEach((region) => {
    const r = parseInt(region);
    if (isNaN(r)) return false;
    const regionExists = regionNoFar.includes(r) || regionFar.includes(r);
    if (!regionExists) return false;
  });

  return true;
}

function calculateRegionResults(regions) {
  return regions.map((region) => {
    if (regionNoFar.includes(region)) return 0;
    if (regionFar.includes(region)) return 1;
    return null; // Ne devrait jamais arriver grâce à validateRegionsExist
  });
}

function applyBusinessLogic(regionCount, results) {
  if (regionCount === 2) {
    if (results[0] === 1 && results[1] === 1) return 1;
    if (results[0] === 0 && results[1] === 0) return 0;
    if ((results[0] === 1 && results[1] === 0) || (results[0] === 0 && results[1] === 1)) return 1;
    return results;
  }

  return results[0];
}

async function numberOfClients(results) {
  let smc = 0;
  for (const result of results) {
    const nbrClients = await tabXx_bonRoute.FindNumberOfClients(result.X_BONROUTE_IDS);
    const isFar = await GetIsFarRegion(result.C_SALESREGION_IDS);
    if (isFar === false) return false;
    if (isFar === 0 && nbrClients[0].NBRCLIENTS >= 20) {
      smc += nbrClients[0].NBRCLIENTS;
    }
    if (isFar === 1 && nbrClients[0].NBRCLIENTS >= 40) {
      smc += nbrClients[0].NBRCLIENTS;
    }
  }
  return smc;
}

async function numberOfPackages(results) {
  const concatBonRouteIds = [
    ...new Set(
      results
        .map((r) => r.X_BONROUTE_IDS)
        .join(",")
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id)
    ),
  ].join(",");
  const result = await tabXx_bonRoute.FindNumberOfPackages(concatBonRouteIds);
  if (result.length === 0) return [{ NBRCOLIS: 0 }];
  return result;
}

function getChiffreRecouverement(id_livreur, dateA, dateB) {
  return new Promise(async (resolve, reject) => {
    let json = { c_bpartner_id: id_livreur, dateA: dateA, dateB: dateB };
    const result = await tabXx_bonRoute.getChiffreRecouv(json);
    if (result.length === 0) return resolve(0);
    return resolve(result[0]);
  });
}
