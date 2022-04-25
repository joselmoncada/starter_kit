const RecycleVe = artifacts.require("./RecycleVe.sol");

contract('RecycleVe', (accounts)=>{
    let recycleVe;

    before(
        async ()=>{
            recycleVe = await RecycleVe.deployed();
        }
    )

    describe('deployment', async ()=>{
        it('deploys successfully', async ()=>{
            const address = await recycleVe.address;
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)

        } )
        
        it('has a name', async()=>{
         const name = await recycleVe.name();
            assert.equal(name,'RecycleVe')
        })

    })

    
    describe('waste units', async ()=>{
        let result, wasteUnitsCount;
        before(
            async ()=>{
                result = await recycleVe.createWasteUnit(
                    'Contaminado',
                    'Chacao',
                    128,

                );
                wasteUnitsCount = await recycleVe.wasteUnitsCount();
            }
        )
        
        it('creates a waste unit', async()=>{
         //success
         assert.equal(wasteUnitsCount,1);
        })

        console.log(result.log);
       
    })

})