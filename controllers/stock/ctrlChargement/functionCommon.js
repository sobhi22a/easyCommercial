var loopData = (_rep) => {
    return new Promise( resole => {
        let sql = "";
        for (let i = 0; i < _rep.length; i++) {
          let xxCharged = _rep[i].XX_CHARGED == "N" ? "N" : "S";
          let latitude = _rep[i].XX_LATITUDE == null ? -1 : _rep[i].XX_LATITUDE;
          let isloaded = _rep[i].ISLOADED == "Y" ? "S" : "N";
          let longitude = _rep[i].XX_LONGITUDE == null ? -1 : _rep[i].XX_LONGITUDE;
          let isLanLong = _rep[i].XX_LATITUDE == null ? "N" : "S";
          let isdelivered = _rep[i].ISDELIVERED == "Y" ? "S" : "N";
          sql =
            sql +
            `("${_rep[i].AD_ORG_ID}","${_rep[i].PACKAGETYPE}","${_rep[i].M_PACKAGE_ID}",
                "${_rep[i].XX_SHIPPER_ID}","${_rep[i].M_SHIPPER_ID}",
                "${_rep[i].XX_BPARTNERSHIPPER_ID}","${_rep[i].DD_VEHICLE_ID}",
                "${xxCharged}","${isloaded}",
                "${_rep[i].XX_DELIVERED}","${_rep[i].XX_VOIDED}",
                "${_rep[i].XX_ARRIVAL}","${_rep[i].ISPRINTED}","${_rep[i].XX_FORWADED}",
                "${isdelivered}","${_rep[i].ISDISPATCHED}","${_rep[i].TRACKINGINFO}",
                "${_rep[i].SHIPDATE}","${_rep[i].M_INOUT_ID}",
                "${_rep[i].DOCUMENTNO}","${_rep[i].MOVEMENTDATE}",
                "${_rep[i].C_BPARTNER_ID}",${_rep[i].XX_SEQORDEREXP},
                "${_rep[i].CLIENT}","${_rep[i].ADDRESS}",
                "${_rep[i].PHONE}","${_rep[i].C_SALESREGION_ID}","${_rep[i].REGION}",
                ${latitude},${longitude},"${isLanLong}", "${_rep[i].REGISTRATION}",
                "${_rep[i].NFCUID}", "${_rep[i].PASSWORD}","${_rep[i].GROUPEEXPEDITION}","${_rep[i].FACTURE}",
                "${_rep[i].GRANDTOTAL}", "${_rep[i].C_BANKACCOUNT_ID}","${_rep[i].AD_ORGTRX_ID}","${_rep[i].ISINVOICED}",
                "${_rep[i].C_DOCTYPE_ID}","${_rep[i].DOCNOSEQUENCE_ID}","${_rep[i].ZSUBPAYMENTRULE_ID}","N"),`;
        }
        sql = sql.substring(0, sql.length - 1);
        resole(sql);
    })
}

module.exports = { loopData };