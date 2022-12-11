pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Card is ERC721URIStorage, Ownable,ERC721Holder  {

    // Structs 
    struct cardResponse {
            string uri;
            uint256 id;
            bool inMarket;
            address owner;
        }

    
    // props 
    uint private fees = 0.01 ether;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256[] private market;
            
    // modifiers 
    modifier onlyOwnerOf(uint _cardId) {
        require(_ownerContainCard(msg.sender,_cardId));
        _;
    }

    // events
    event NftBought(address _seller, address _buyer, uint256 _price);

    //mappings
    mapping(address => uint256[]) public userOwnedCards;

    constructor() ERC721("Card NFT", "NFT") {

    }

    // private functions
    function _removeCardFromOwner(address _owner,uint256 _cardId) private 
    {
        uint ownedCardsCount = userOwnedCards[_owner].length;
        for (uint i = 0; i < ownedCardsCount; i++) {
            if(userOwnedCards[_owner][i] == _cardId){
                userOwnedCards[_owner][i] = userOwnedCards[_owner][ownedCardsCount-1];
                userOwnedCards[_owner].pop();
                break;
            }
        }
    }

    function _transferCard(address _from, address _to, uint256 _cardId) private {
        _removeCardFromOwner(_from,_cardId);
        userOwnedCards[_to].push(_cardId);
        IERC721 nft = IERC721(address(this));
        nft.transferFrom(_from, _to, _cardId);
    }

    function _ownerContainCard(address _owner,uint256 _cardId) private returns(bool){
        bool _isOwner = ownerOf(_cardId) == _owner;
        if(_isOwner){
            uint ownedCardsCount = userOwnedCards[_owner].length;
            for(uint i = 0; i < ownedCardsCount; i++){
                if(userOwnedCards[_owner][i] == _cardId){
                    return true;
                }
            }
        }
        return false;

    }

    function _isInMarket(uint256 _cardId) private returns(bool){
        uint cardsCount = market.length;
        for (uint i = 0; i < cardsCount; i++) {
            if(market[i] == _cardId){
                return true;
            }
        }

        return false;
    }

    function _removeCardFromMarket(uint256 _cardId) private 
    {
        uint cardsCount = market.length;
        for (uint i = 0; i < cardsCount; i++) {
            if(market[i] == _cardId){
                market[i] = market[cardsCount-1];
                market.pop();
                break;
            }
        }
    }
    
    

    // functions

    function mintCard(address recipient, string memory cardURI)
     public payable onlyOwner 
    {
        _tokenIds.increment();
        uint256 cardId = _tokenIds.current();
        _safeMint(recipient, cardId);
        _setTokenURI(cardId, cardURI);
        approve(address(this),cardId);
        userOwnedCards[recipient].push(cardId);
        market.push(cardId);
    }

    function getCardsByOwner(address owner) public view returns (cardResponse[] memory)  {
        uint ownedCardsCount = userOwnedCards[owner].length;
        cardResponse[] memory result = new cardResponse[](ownedCardsCount);
        uint cardsCount = market.length;
        for (uint i = 0; i < ownedCardsCount; i++) {
            uint256 cardId = userOwnedCards[owner][i];
            result[i].uri = tokenURI(cardId);
            result[i].id = cardId ;
            result[i].inMarket = false;
            result[i].owner = ownerOf(cardId);
            for (uint j = 0; j < cardsCount; j++) {
                if(market[j] == cardId){
                    result[i].inMarket = true;
                    break;
                }
            }
        }
        return result;
    }

    function getMarketCards() public view returns (cardResponse[] memory)  {
        uint cardsCount = market.length;
        cardResponse[] memory result = new cardResponse[](cardsCount);

        for (uint i = 0; i < cardsCount; i++) {
            result[i].uri = tokenURI(market[i]);
            result[i].id =  market[i];
            result[i].inMarket  = true;
            result[i].owner = ownerOf(market[i]);
        }
        return result;
    }


    
    function buyCard(address _buyer,uint256 _cardId) public payable {
        require(_exists(_cardId), "transfer of non existing token");
       require(_buyer.balance >= msg.value, 'Solde insuffisant');
       address _seller = ownerOf(_cardId);
       require(_buyer != _seller,'Can not buy owned card');
        _transferCard(_seller, payable(_buyer), _cardId);
       payable(_seller).transfer(msg.value);
       _removeCardFromMarket(_cardId);
        emit NftBought(_seller, _buyer, msg.value);
    }

    function sendCard(address _to,uint256 _cardId) public payable onlyOwnerOf(_cardId) {
        address _seller = ownerOf(_cardId);
        require(_to != _seller,'Can not send to self');

        approve(address(this),_cardId);
        _transferCard(_seller, payable(_to), _cardId);

        emit NftBought(_seller, _to, msg.value);
    }

    function saleCard(uint256 _cardId) public  onlyOwnerOf(_cardId){
        require(_isInMarket(_cardId) == false,'Card already in market');
        market.push(_cardId);
        approve(address(this),_cardId);
    }

    function stopSallingCard(uint256 _cardId) public onlyOwnerOf(_cardId){
        require(_isInMarket(_cardId) == true,'Card not in market');
        _removeCardFromMarket(_cardId);
    }




}