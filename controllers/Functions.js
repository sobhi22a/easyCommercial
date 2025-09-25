function getUpdatedOperationType(operationType, prospect) {
    if (operationType == "R" && prospect == 2) {
      return "DR";
    }
  
    if (operationType == "B" && prospect == 2) {
      return "BR";
    }
  
    if (operationType == "B" && prospect == 0) {
      return "B";
    }
  
    if (operationType == "Y" && prospect == 0) {
      return "Y";
    }
  
    return operationType;
  }

function getValide(operationType) {
    if (operationType == "DR" || operationType == "Y") {
        return "Y";
    } else if (operationType == "BR" || operationType == "B") {
        return "B";
    }
}

function getReafecteA(adOrgId) {
    switch(adOrgId) {
        case 1000000:
            return 1035024;
        case 1000416: 
            return 1044588;
        case 1000518: 
            return 1044589;
        default: 1035024;
     
    }
}

const StatutProsper = {
    CLIENT_OPER: 0,
    CLIENT_PROSPECT: 1,
    CLIENT_PROSPECT_VALIDE: 2,
    CLIENT_PROSPECT_NOT_VALIDE: 3,
    CLIENT_PROSPECT_COMMAND_VALIDE: 4,
  }

  module.exports = { getUpdatedOperationType, getValide, getReafecteA, StatutProsper };