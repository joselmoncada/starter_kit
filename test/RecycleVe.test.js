const RecycleVe = artifacts.require("./RecycleVe.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()


contract('RecycleVe', ([deployer, seller, buyer])=>{
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

    
    describe('creates a waste unit', async ()=>{
        let result, wasteUnitsCount;
        before(
            async ()=>{
                console.log('ACCOUNT SELLER: ', seller);
                result = await recycleVe.createWasteUnit(
                    'Contaminado',
                    'Chacao',
                    'LDPE',
                    'Shreded flakes',
                     Math.floor(new Date().getTime() / 1000),
                    2,
                    'test@gmail.com',
                    {from: seller}
                );
                wasteUnitsCount = await recycleVe.wasteUnitsCount();
            }
        )
        
        it('creates a waste unit', async()=>{
         //success
         //assert.equal(wasteUnitsCount,1);
         const event = result.logs[0].args;
        assert.equal(event.id.toNumber(),wasteUnitsCount.toNumber(), 'Id is correct');
        assert.isNotEmpty(event.condition, 'Condition is valid');
        assert.isNotEmpty(event.receptionHub, 'Location is valid');
        assert.isNotEmpty(event.materialType, 'Material Type is valid');
        assert.isNotEmpty(event.shape, 'Shape is valid');
        assert.isAbove(event.weight.toNumber(),0, 'Weight is valid');
        assert.isAbove(event.price.toNumber(),0, 'Price is valid');
        assert.equal(event.owner, seller, 'Owner is correct');
        assert.equal(event.purchased, false, 'Purchased status is correct');
        console.log('Waste Unit created: ', result.logs);

        //failure: product must have a condition
        await await recycleVe.createWasteUnit(
            '',
            'Chacao',
            'LDPE',
            'Shreded flakes',
            2,
            {from: deployer}).should.be.rejected;
        //failure: product must have a location
        await await recycleVe.createWasteUnit(
            'Condition',
            '',
            'LDPE',
            'Shreded flakes',
            2,
            {from: deployer}).should.be.rejected;
             //failure: product must have a Material Type
        await await recycleVe.createWasteUnit(
            'Condition',
            'Chacao',
            '',
            'Shreded flakes',
            2,
            {from: deployer}).should.be.rejected; 
             //failure: product must have a Shape
        await await recycleVe.createWasteUnit(
            'Condition',
            'Chacao',
            'LDPE',
            '',
            2,
            {from: deployer}).should.be.rejected;
        //failure: product weight must be bigger than 0
        await await recycleVe.createWasteUnit(
            'Condition',
            'Chacao',
            'LDPE',
            'Shreded flakes',
            0,
            {from: deployer}).should.be.rejected;
        })

        it('list waste units', async()=>{

            const wasteUnit = await recycleVe.units(wasteUnitsCount);
            assert.equal(wasteUnit.id.toNumber(),wasteUnitsCount.toNumber(), 'Id is correct');
            assert.isNotEmpty(wasteUnit.condition, 'Condition is valid');
            assert.isNotEmpty(wasteUnit.receptionHub, 'Location is valid');
            assert.isNotEmpty(wasteUnit.materialType, 'Material Type is valid');
             assert.isNotEmpty(wasteUnit.shape, 'Shape is valid');
            assert.isAbove(wasteUnit.weight.toNumber(),0, 'Weight is valid');
            assert.equal(wasteUnit.owner, seller, 'Owner is correct');
            assert.equal(wasteUnit.purchased, false, 'Purchased status is correct');
            
           })

        it('Sells wasteUnits', async()=>{

            //track seller balance before purchased
            let oldSellerBalance;
            oldSellerBalance = await web3.eth.getBalance(seller);
            oldSellerBalance = new  web3.utils.BN(oldSellerBalance);

            //SUCCESS: Buyer makes purchase
            result = await recycleVe.purchaseWasteUnit(wasteUnitsCount ,{from: buyer, value: 2});
            console.log('Waste Unit purchased: ', result.logs);
            
            const event = result.logs[0].args;
            console.log('Compare IDS id:', event.id.toNumber(), "wasteUnitsCount: ", wasteUnitsCount.toNumber());
            assert.equal(event.id.toNumber(),wasteUnitsCount.toNumber(), 'Id is correct');
            assert.isNotEmpty(event.condition, 'Condition is valid');
            assert.isNotEmpty(event.receptionHub, 'Location is valid');
            //check shape
            //check material type
            assert.isAbove(event.weight.toNumber(),0, 'Weight is valid');
            assert.isAbove(event.price.toNumber(),0, 'Price is valid');
            assert.equal(event.owner, buyer, 'Owner is correct');
            assert.equal(event.purchased, true, 'Purchased status is correct');

            //Check the seller received funds

            let newSellerBalance;
            newSellerBalance =  await web3.eth.getBalance(seller);
            newSellerBalance = new web3.utils.BN(newSellerBalance);

            let price;
            price = 2;
            price = new web3.utils.BN(price);

            const expectedBalance = oldSellerBalance.add(price);
            assert.equal(newSellerBalance.toString(),expectedBalance.toString(), 'The new balance is correct');

            //FAILURE: 

            //tries to buy an product that doesnt exist
            await recycleVe.purchaseWasteUnit(99, {from: buyer, value: web3.utils.toWei('1','Ether')}).should.be.rejected;
            //Buyer tries to buy without enough ether
            await recycleVe.purchaseWasteUnit(wasteUnitsCount, {from: buyer, value: 1}).should.be.rejected
            // //deployer tries to buy product, product cant be purchased twice
            // await recycleVe.purchaseWasteUnit(wasteUnitsCount, {from: deployer, value: web3.utils.toWei('1','Ether')}).should.be.rejected
            // buyer tries to buy again, buyer cannot be the seller
            await recycleVe.purchaseWasteUnit(wasteUnitsCount, {from: buyer, value: web3.utils.toWei('1','Ether')}).should.be.rejected
            // await recycleVe.purchaseWasteUnit(wasteUnitsCount, {from: deployer, value: web3.utils.toWei('1','Ether')}).should.be.rejected
        })
       
    })

})