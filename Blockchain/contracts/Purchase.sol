pragma solidity ^0.8.7;

contract Purchase {
    struct Ticket {
        string departure;
        string arrival;
        string  travelTime;
        string name;
        uint price;
    }

    struct walet {
        Ticket[] ticketList;
    }

    mapping(address => walet) userTowalet;
        event NewTicket(string departure, string arrival,string travelTime, string name, uint price);

    function showBalance() public view returns (uint) {
        return address(this).balance;
    }

    function buyTickets(address _buyer, string memory _departure, string memory _arrival, string memory _travelTime,
        string memory _name, uint _price) public payable returns (Ticket[] memory)
    {
        require(_buyer.balance >= msg.value, 'Solde insuffisant');
        userTowalet[msg.sender].ticketList.push(Ticket(_departure, _arrival, _travelTime, _name, _price));
        emit NewTicket(_departure, _arrival, _travelTime, _name, _price);
        return userTowalet[msg.sender].ticketList;
    }

    function showTicket(address _adress) public view returns (Ticket[] memory){
        return userTowalet[_adress].ticketList;
    }


}
