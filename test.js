let FamiliesOriginal = [
    {
      Jokers: {
        Dave: false,
        Kate: false
      },
      SecretSantas: {
        Victoria: false,
        Tyler: false
      }
    },
    {
      Jokers: {
        Bill: false,
        Lindsay: false
      },
      SecretSantas: {
        Holly: false,
        Cora: false,
        Lana: false
      }
    },
    {
      Jokers: {
        Corine: false,
        Mike: false
      },
      SecretSantas: {
        Jace: false,
        Madison: false,
        Dakota: false
      }
    },
    {
      Jokers: {
        Sam: false,
        Brian: false,
        BrianJr: false
      },
      SecretSantas: {
        Ava: false,
        Evan: false,
        Shea: false
      }
    },
    {
      Jokers: {
        Steph: false,
      },
      SecretSantas: {
        Rae: false
      }
    },
    {
      Jokers: {
        Jean: false,
      }
    },
    {
      Jokers: {
        AuntEllen: false,
      }
    }
];

let Families = FamiliesOriginal;
let totalNumFamilies = Families.length;
let typeCounts = {
    Jokers: 0,
    SecretSantas: 0
};
let pairs = [];

async function startPairing(){
    await getPairings();
}
async function getPairings(){
    Families = JSON.parse(JSON.stringify(FamiliesOriginal));
    console.log(Families)
    let typeCounts = {
        Jokers: 0,
        SecretSantas: 0
    };
    let pairs = [];
    try {
        Families.forEach((familyObj, familyIndex) => {
            Object.entries(familyObj).forEach(typeObj => {
                const [type, typ] = typeObj;
                Object.entries(typ).forEach(async memberObj => {
                    const [member, hasPair] = memberObj;
                    let memberToPair = await findPair(familyIndex, type);
                    if(memberToPair == "no eligible") return
                    pairs.push(`${member} has ${memberToPair}`)
                    typeCounts[type]++;
                });
            });
        });

        if(typeCounts.Jokers != 12 || typeCounts.SecretSantas != 12){
            setTimeout(async () => {
                console.log("Bad Pairing",pairs,typeCounts);
                await getPairings();
            }, "50");
        }
        else {
            console.log("Good", pairs)
        }
        // else {
        //     Families.forEach((familyObj, familyIndex) => {
        //         Object.entries(familyObj).forEach(typeObj => {
        //         const [type, typeValue] = typeObj;
        //             Object.entries(typeValue).forEach(memberObj => {
        //                 const [member, hasPair] = memberObj;
        //                 if(!hasPair){
        //                     console.log(`${member} not paired`)
        //                 }
        //             });
        //         });
        //     }); 
        // }
    }
    catch (e) {
        console.log("getPairings caught")
    }
}
async function findPair(index, type){
    try {
        let membersEligibleToGift = [];
        Families.forEach((familyObj, familyIndex) => {
            if(familyIndex != index){
                Object.entries(familyObj).forEach(typeObj => {
                    const [typeName, typeValue] = typeObj;
                    if(typeName == type){
                        Object.entries(typeValue).forEach(memberObj => {
                            const [member, hasPair] = memberObj;
                            if(!hasPair){
                                membersEligibleToGift.push({
                                    Name: member,
                                    FamilyIndex: familyIndex,
                                    Type: typeName
                                })
                            }
                        });
                    }
                });
            }
        });
        if(membersEligibleToGift.length > 0){
            let member = membersEligibleToGift[Math.floor(Math.random() * (membersEligibleToGift.length - 1))];
            Families[member.FamilyIndex][member.Type][member.Name] = true;
            return member.Name;
        }
        return "no eligible"
        // let familyToGift = getRandomFamilyNum(index);  
        // let members = Object.keys(Families[familyToGift][type])
        // let member = members[Math.floor(Math.random() * (members.length - 1))];
        // if (Families[familyToGift][type][member]){
        //     console.log(Families)
        //     console.log("bad pair", member, Families[familyToGift][type][member])
        //     //return await findPair(index, type)
        // }
        // else{
        //     Families[familyToGift][type][member] = true;
        //     return member;
        // }
    }
    catch(e){
        console.log("findPair caught: ", e);
    }
}
function getRandomFamilyNum(index){
    let randomFamilyIndex = Math.floor(Math.random() * totalNumFamilies);
    if(index == randomFamilyIndex) return getRandomFamilyNum(index);
    return randomFamilyIndex;
}

startPairing();