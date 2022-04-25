pragma solidity ^0.8.0;

contract RecycleVe{

    string public name;
    uint public wasteUnitsCount = 0;
    mapping(uint => WasteUnit)  public units;
   // mapping(uint => Collector)  public collectors;

    struct Collector{
        uint id;
        string phoneNumber;
        string email;
    }

       struct WasteUnit{
        uint id;
        string condition;
        string receptionHub;
        uint weight;
        address owner;
        bool status;
        Collector collector;
    }

     constructor() public{
        name = "RecycleVe";
    }

    event wasteUnitCreated(
         uint id,
        string condition,
        string receptionHub,
        uint weight,
        address owner,
        bool status,
        Collector collector
    );

   

    function createWasteUnit(
        string memory _condition,
        string memory _receptionHub,
        uint _weight
    ) public {
           WasteUnit memory wasteUnit = WasteUnit(
            wasteUnitsCount,
            _condition,
            _receptionHub,
            _weight,
            msg.sender,
            false,
            Collector(0, "", "")
        );
        units[wasteUnit.id] = wasteUnit;
        emit wasteUnitCreated(
            wasteUnitsCount,
            _condition,
            _receptionHub,
            _weight,
            msg.sender,
            false,
            Collector(0, "", ""));
        wasteUnitsCount++;
    
    }



}