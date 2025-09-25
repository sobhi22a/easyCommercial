const fs = require("fs");
// const pdf = require("pdf-creator-node");

const tabNclient = require("../../models/tabNclients");

const html = fs.readFileSync("./pdf/ficheNouveauClient.html", "utf-8");

var options = {
  format: "A4",
  orientation: "portrait",
  border: "4mm",
  typeOpen: "download",
  header: {
    height: "20mm",
    contents:
      '<div style="text-align: center;"><h1><u>Fiche Nouveau Client</u></h1></div>',
  },
  footer: {
    height: "20mm",
    contents: {
      first: "1/1",
      2: "Second page", // Any page number is working. 1-based index
      // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      // last: ''
    },
  },
};

module.exports = {
  imprimerFicheClient: (req, res) => {
    let q = req._parsedOriginalUrl.query;
    q = parseInt(q.split("=")[1]);
    let json = { indice: 1, idClient: q };
    tabNclient.select(json, async (reponse) => {
      let rep = await reponse;
      let org = rep[0].ad_org;
      if (org == 1000000) {
        org = "Sarl Attiryak Pharm";
      } else if (org == 1000517) {
        org = "Sarl Palma Pharm";
      } else if (org == 1000416) {
        org = "Eurl Seif Pharm";
      }
      let dateCreation = rep[0].dateCreation;
      let bl = rep[0].bl;
      if (bl == 1) {
        bl = "BL";
      } else if (bl == 0) {
        bl = " ";
      }
      let fact = rep[0].fact;
      if (fact == 1) {
        fact = "FACT";
      } else if (fact == 0) {
        fact = " ";
      }
      let para = rep[0].para;
      if (para == 1) {
        para = "BL(para)";
      } else if (para == 0) {
        para = " ";
      }
      var document = {
        html: html,
        data: {
          ad_org: org,
          operateur: rep[0].operateur,
          nomClient: rep[0].nomClient,
          nTel1: rep[0].nTel1,
          nTel2: rep[0].nTel2,
          adresse: rep[0].adresse1,
          region: rep[0].region,
          wilaya: rep[0].wilaya,
          mdp: rep[0].mdp,
          rc: rep[0].rc,
          nif: rep[0].nif,
          ai: rep[0].ai,
          svc: rep[0].svc,
          svr: rep[0].svr,
          bl: bl,
          fact: fact,
          para: para,
          dateCreation: dateCreation,
        },
        path: rep[0].nomClient + ".pdf",
      };

      pdf
        .create(document, options)
        .then((res1) => {
          res.download(res1.filename);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },
};
