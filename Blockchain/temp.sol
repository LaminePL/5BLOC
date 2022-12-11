//Contract based on [https://docs.openzeppelin.com/contracts/4.x/erc721](https://docs.openzeppelin.com/contracts/4.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Card is ERC721URIStorage, Ownable,ERC721Holder  {

    // Structs 
    struct CardResponse {
            string uri;
            uint256 id;
        }
    struct CardItem {
            bool sellable;
            uint256 id;
        }
    
    // props 
    uint private fees = 0.01 ether;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
            
    // modifiers 
    modifier onlyOwnerOf(uint _cardId) {
        require(_ownerContainCard(msg.sender,_cardId));
        _;
    }

    // events
    event NftBought(address _seller, address _buyer, uint256 _price);

    //mappings
    mapping(address => CardItem[]) userOwnedCards;

    //storage

    constructor() ERC721("Card NFT", "NFT") {}

    // private functions
    function _removeCardFromOwner(address _owner,uint256 _cardId) private 
    {
        uint ownedCardsCount = userOwnedCards[_owner].length;
        for (uint i = 0; i < ownedCardsCount; i++) {
            if(userOwnedCards[_owner][i].id == _cardId){
                userOwnedCards[_owner][i] = userOwnedCards[_owner][ownedCardsCount-1];
                userOwnedCards[_owner].pop();
                break;
            }
        }
    }

    function _transferCard(address _from, address _to, uint256 _cardId) private {
        _removeCardFromOwner(_from,_cardId);
        CardItem memory c = CardItem({
            id : _cardId,
            sellable : false
        });
        userOwnedCards[_to].push(c);
        IERC721 nft = IERC721(address(this));
        nft.transferFrom(_from, _to, _cardId);
    }

    function _ownerContainCard(address _owner,uint256 _cardId) private returns(bool){
        bool _isOwner = ownerOf(_cardId) == _owner;
        if(_isOwner){
            uint ownedCardsCount = userOwnedCards[_owner].length;
            for(uint i = 0; i < ownedCardsCount; i++){
                if(userOwnedCards[_owner][i].id == _cardId){
                    return true;
                }
            }
        }
        return false;

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
        CardItem memory c = CardItem({
            id : cardId,
            sellable : false
        });

        userOwnedCards[recipient].push(c);
    }

    function getCardsByOwner(address owner) public view returns (CardResponse[] memory)  {
        uint ownedCardsCount = userOwnedCards[owner].length;
        CardResponse[] memory result = new CardResponse[](ownedCardsCount);

        for (uint i = 0; i < ownedCardsCount; i++) {
            result[i].uri = tokenURI(userOwnedCards[owner][i].id);
            result[i].id =  userOwnedCards[owner][i].id;
        }
        return result;
    }

    function getMarketCards() public view returns (CardResponse[] memory)  {
        uint ownersCount = userOwnedCards.length;
        CardResponse[] memory result = new CardResponse[]();

        for (uint i = 0; i < ownersCount; i++) {
            uint ownedCardsCount = userOwnedCards[i].length;
            for (uint j = 0; j < ownedCardsCount; j++) {
                if(userOwnedCards[i][j].sellable == true){
                    CardResponse memory cr = new CardResponse();
                    cr.uri = tokenURI(userOwnedCards[i][j].id);
                    cr.id =  userOwnedCards[i][j].id;
                    result.push(cr);
                    }
            }
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
        emit NftBought(_seller, _buyer, msg.value);
    }

    function sendCard(address _to,uint256 _cardId) public payable onlyOwnerOf(_cardId) {
        require(_to.balance >= msg.value, 'Solde insuffisant');
        address _seller = ownerOf(_cardId);
        require(_to != _seller,'Can not send to self');

        approve(address(this),_cardId);
        _transferCard(_seller, payable(_to), _cardId);
        if(msg.value > 0)
            payable(_seller).transfer(msg.value);
        emit NftBought(_seller, _to, msg.value);
    }

    function soldCard(address _owner,uint256 _cardId) public  onlyOwnerOf(_cardId) {

         uint ownedCardsCount = userOwnedCards[_owner].length;
        for (uint i = 0; i < ownedCardsCount; i++) {
            if(userOwnedCards[_owner][i].id == _cardId){
                userOwnedCards[_owner][i].sellable = true;
                break;
            }
        }

    }




}