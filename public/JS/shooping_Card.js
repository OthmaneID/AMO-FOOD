if(document.readyState =='loading'){
    document.addEventListener('DOMContentLoaded',ready)
}else{
    ready()
}
console.log("Hello")
function ready() {
    
    var removeCartItemButton= document.getElementsByClassName('command-del')

    for(var i=0;i<removeCartItemButton.length;i++){
        var button=removeCartItemButton[i]
        button.addEventListener('click',removeCartItem)
    }


    var quantityInputs=document.getElementsByClassName('command-Quant')
    for(var i=0;i<quantityInputs.length;i++){
        var input=quantityInputs[i]
        input.addEventListener('change',quantityChanged)
    }

    var addToCartButtons=document.getElementsByClassName('shopping')
    for(var i=0;i<addToCartButtons.length;i++)
    {
         var button=addToCartButtons[i]
         button.addEventListener('click',addToCartClicked)
    }

    var passeCommandButton=document.getElementById('Order-btn');
    passeCommandButton.addEventListener('click',passCommand);

    var eye_btns=document.getElementsByClassName('eye')
        for(var i=0;i<eye_btns.length;i++)
    {
         var eye=eye_btns[i]
         eye.addEventListener('click',showPopUp)
    }
    var Close_PopUp_Btn=document.getElementsByClassName('close-PopUp')[0];
    Close_PopUp_Btn.addEventListener('click',ClosePopUp)
}


function showPopUp(event)
{
    event.preventDefault();
    var id=this.id;
    
    var PopUp=document.getElementsByClassName('bg-PopUp')[0];
    PopUp.style.display=null;
}

function ClosePopUp(event)
{
    var PopUp=document.getElementsByClassName('bg-PopUp')[0];
    PopUp.style.display='none';
}

function passCommand(event)
{
    var cartItems=document.getElementsByClassName('order-listing')[0]
    var cartItemNames=cartItems.getElementsByClassName('command-titre')
    if(cartItemNames.length==0)
    {
        alert('Add some commands First');
    }
    else{
        var command=[]
        for(var i=0;i<cartItemNames.length;i++)
        {
            var commandName=cartItemNames[i].innerText;
            var commandQtt=cartItems.getElementsByClassName('command-Quant')[i].value;
            var commandPrice=cartItems.getElementsByClassName('command-price')[i].innerText;
            commandPrice=commandPrice.replace('DH','')*commandQtt
            var commandJSON={title:commandName,Qtt:commandQtt,price:commandPrice}

            command.push(commandJSON)
        }
        var xhttp=new XMLHttpRequest();
       
        for(var i=0;i<command.length;i++)
        {
            console.log(command[i].title)
        }
        if(cartItemNames==0)
        {  
            window.location.replace('/food')
        }else{
            xhttp.open('POST','/Command_info',true);
            xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
            xhttp.send(JSON.stringify(command))
            setInterval(function(){
                 window.location.replace("/Command_Info");
            },500)
           
        }

    }
}


function removeCartItem (event){
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event){
    var input = event.target
    if(isNaN(input.value) || input.value<=0){
        input.value = 1

    }
    updateCartTotal()
}


function addToCartClicked(event){
    event.preventDefault();
    console.log("addToCartClicked Funtion")
    var button = event.target
    var shopItem=button.parentElement.parentElement.parentElement.parentElement.parentElement
    var title=shopItem.getElementsByClassName('food-title')[0].innerText
    var categorie=shopItem.getElementsByClassName('Categorie')[0].innerText
    var price=shopItem.getElementsByClassName('price')[0].innerText.replace('DH','')
    var imageSrc=shopItem.getElementsByClassName('food-img')[0],
    style = imageSrc.currentStyle || window.getComputedStyle(imageSrc, false),
    bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");

    addItemToCart(title,categorie,price,bi)
}
function addItemToCart(title,categorie,price,imageSrc)
{
    
    console.log('addItemToCart function')
    var cartRow=document.createElement('div')

    var cartRoxContents="<div class='Command'><div class='Command-img' style='background-image:url("+imageSrc+");'></div><div class='command-txt' style='margin-left:15px ;'><div class='command-titre'>"+title+"</div><div class='command-price'>"+price+"DH</div></div><div class='command-Quant-Section'><input type='number' name='command-Quant' id='command-Quant' min='1'  value='1' class='command-Quant'/><div class='command-del  fas fa-trash-alt'></div></div>"
    var cartItems=document.getElementsByClassName('order-listing')[0]
    var cartItemNames=cartItems.getElementsByClassName('command-titre')
    for(var i=0;i<cartItemNames.length;i++)
    {
        
        if(cartItemNames[i].innerText==title)
        {
            alert('This Item is Already Added to the Cart')
            return
        }
    }
    cartRow.innerHTML=cartRoxContents
    console.log(imageSrc)
    cartItems.append(cartRow)
    updateCartTotal()
    cartRow.getElementsByClassName('command-del')[0].addEventListener('click',removeCartItem )
    cartRow.getElementsByClassName('command-Quant')[0].addEventListener('change',quantityChanged)

}

function updateCartTotal(){
    var cartItemContainer=document.getElementsByClassName('order-listing')[0]
    var cartRows = cartItemContainer.getElementsByClassName('Command')
    var foodQuant=document.getElementsByClassName('food-count')[0]
    var foodQuant_Phone=document.getElementsByClassName('food-count')[1]
    var total=0;
    var count=0;
    for(var i=0;i<cartRows.length;i++){
       
        var cartRow=cartRows[i];
        var priceElement=cartRow.getElementsByClassName('command-price')[0]
        var quatityElement=cartRow.getElementsByClassName('command-Quant')[0]

        var price=parseFloat(priceElement.innerText.replace('DH',''))

        var quatity=quatityElement.value

        total=total+(price*quatity)
        count +=parseInt(quatity)
    
    }
       foodQuant.innerHTML=count;
       foodQuant_Phone.innerHTML=count;
       total=Math.round(total*100)/100
       document.getElementsByClassName('price-sous')[0].innerText=total.toString();
       document.getElementsByClassName('price-tot')[0].innerText=total+10
}