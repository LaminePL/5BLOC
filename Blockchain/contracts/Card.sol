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
    struct cardResponse {
            string uri;
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

    event NftSent(address _seller, address _buyer);

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
    
    

    // functions

    function mintCard(address recipient, string memory cardURI)
     public payable onlyOwner 
    {
        _tokenIds.increment();
        uint256 cardId = _tokenIds.current();
        _safeMint(recipient, cardId);
        _setTokenURI(cardId, cardURI);
        setApprovalForAll(address(this),true);
        userOwnedCards[recipient].push(cardId);
    }

    function getCardsByOwner(address owner) public view returns (cardResponse[] memory)  {
        uint ownedCardsCount = userOwnedCards[owner].length ;
        cardResponse[] memory result = new cardResponse[](ownedCardsCount);

        for (uint i = 0; i < ownedCardsCount; i++) {
            result[i].uri = tokenURI(userOwnedCards[owner][i]);
            result[i].id =  userOwnedCards[owner][i];
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
        address _seller = ownerOf(_cardId);
        require(_to != _seller,'Can not send to self');

        approve(address(this),_cardId);
        _transferCard(_seller, payable(_to), _cardId);
        if(msg.value > 0)
            payable(_seller).transfer(msg.value);
        emit NftSent(_seller, _to);
    }


   function saleCard(address _to,uint256 _cardId) public payable onlyOwnerOf(_cardId) {
        require(_to.balance >= msg.value, 'Solde insuffisant');
        address _seller = ownerOf(_cardId);
        require(_to != _seller,'Can not send to self');

        approve(address(this),_cardId);
        _transferCard(_seller, payable(_to), _cardId);
        if(msg.value > 0)
            payable(_seller).transfer(msg.value);
        emit NftBought(_seller, _to, msg.value);
    }



}