<template> 
<ul>
  <li v-for="pair in goodPairs" >
    {{ pair }}
  </li>
</ul>
</template>

<style scoped>
</style>

<script setup>
  import { ref, onMounted } from 'vue'
  const FamiliesOriginal = [
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
  let pairs = [];
  const goodPairs = ref([]);

  async function startPairing(){
      await getPairings();
  }
  async function getPairings(){
      Families = JSON.parse(JSON.stringify(FamiliesOriginal));
      let pairs = [];
      try {
          Families.forEach((familyObj, familyIndex) => {
              Object.entries(familyObj).forEach(typeObj => {
                  const [type, typ] = typeObj;
                  Object.entries(typ).forEach(async memberObj => {
                      const [member, hasPair] = memberObj;
                      let memberToPair = await findPair(familyIndex, type);
                      if(memberToPair == "no eligible") return
                      goodPairs.value.push(`${member} has ${memberToPair}`)
                  });
              });
          });
          console.log(await goodPairs.value.length)
          if(await goodPairs.value.length != 24){
              setTimeout(async () => {
                goodPairs.value.length = 0;
                  console.log("Bad Pairing",pairs);
                  await getPairings();
              }, "50");
          }
          else {
              console.log("Good", pairs)
          }
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
              let member = membersEligibleToGift.reverse()[Math.floor(Math.random() * (membersEligibleToGift.length - 1))];
              Families[member.FamilyIndex][member.Type][member.Name] = true;
              return member.Name;
          }
          return "no eligible"
      }
      catch(e){
          console.log("findPair caught: ", e);
      }
  }
  onMounted(async () => {
    await startPairing();
  })
</script>
