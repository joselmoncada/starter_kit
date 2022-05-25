pragma solidity ^0.8.0;

contract RecycleVe{

    mapping(uint => WasteUnit)  public units;
    string public name;
    uint public wasteUnitsCount = 0;
  

       struct WasteUnit{
        uint id;
        string condition;
        string receptionHub;

        string materialType;  
        string shape;   
        uint receptionDate;

        uint weight;
        uint price;
        bool purchased;
        address  owner;
        string collectorEmail;
        bool rewardReclaimed;
      }

     constructor() public{
        name = "RecycleVe";
    }

    event wasteUnitCreated(
         uint id,
        string condition,
        string receptionHub,

        string materialType,
string shape,
uint receptionDate,

        uint weight,
        uint price,
        bool purchased,
        address  owner,
        string collectorEmail,
        bool rewardReclaimed
    );

   

    function createWasteUnit(
        string memory _condition,
        string memory _receptionHub,

        string memory _materialType,
        string memory _shape,
        uint _receptionDate,

        uint _weight,
        string memory _collectorEmail
    ) public {

        //requires a valid condition
        require(bytes(_condition).length>0 , 'requires a valid WasteUnitCondition');
        //requires a valid receptionHub
        require(bytes(_receptionHub).length>0, 'requires a valid ReceptionHub');
        //requires a valid materialType
        require(bytes(_materialType).length>0 , 'requires a valid material Type');
        //requires a valid weight
        require(_weight>0 , 'requires a valid weight');

           WasteUnit memory wasteUnit = WasteUnit(
            wasteUnitsCount + 1,
            _condition,
            _receptionHub,
            _materialType,
            _shape,
            _receptionDate,
            _weight,
            _weight,
            false,
            msg.sender,
            _collectorEmail,
            false
        );
        units[wasteUnit.id] = wasteUnit;
        emit wasteUnitCreated(
            wasteUnitsCount + 1,
            _condition,
            _receptionHub,
             _materialType,
            _shape,
            _receptionDate,
            _weight,
            _weight,
            false,
            msg.sender,
            _collectorEmail,
            false
            );
        wasteUnitsCount++;
    
    }

  event WasteUnitPurchased(
         uint id,
        string condition,
        string receptionHub,

        
        string materialType, 
        string shape,
        uint receptionDate,


        uint weight,
        uint price,
        bool purchased,
        address  owner,
        string collectorEmail,
        bool rewardReclaimed
    );

    function purchaseWasteUnit(uint _id) public payable{
        //fetch the unit
        WasteUnit memory _wasteUnit = units[_id];
        //fetch de owner
        address  _seller = _wasteUnit.owner;
        //make sure the product is valid
        require(_wasteUnit.id>0 && _wasteUnit.id <= wasteUnitsCount, "Waste Unit id invalid");
        //require that there is enough Ether in the transaction
        // require(msg.value >= _wasteUnit.price)
         require(msg.value >= _wasteUnit.price, "transaction amount smaller than wasteUnitPrice");
         //requires that the product has not been purchased yet
         //require(!_wasteUnit.purchased, "This product has been pruchased already");
         //require the buyer is not the seller
         require(_seller != msg.sender, "Seller can't buy its own product");

        //transfer ownership to buyer
        _wasteUnit.owner = msg.sender;
        //mark as purchased
        _wasteUnit.purchased = true;
        //update product
        units[_id] = _wasteUnit;
        //pay the seller
        payable(_seller).transfer(msg.value);
        //trigger an event
           emit WasteUnitPurchased(
            _id ,
            _wasteUnit.condition,
             _wasteUnit.receptionHub,
            _wasteUnit.materialType,
            _wasteUnit.shape,
            _wasteUnit.receptionDate,
            _wasteUnit.weight,
            _wasteUnit.weight,
            _wasteUnit.purchased,
            msg.sender,
            _wasteUnit.collectorEmail,
            _wasteUnit.rewardReclaimed
            );
        

    }
}