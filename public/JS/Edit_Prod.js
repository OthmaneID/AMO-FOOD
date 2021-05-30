if(document.readyState =='loading'){
    document.addEventListener('DOMContentLoaded',ready)
}else{
    ready()
}
function ready(){
    console.log("Hello Prod  Edit js")
    var Update_BTN=document.getElementsByClassName('Update')[0];

    Update_BTN.addEventListener('click',Valider)

    var Cancel_BTN=document.getElementsByClassName('Cancel')[0];

    Cancel_BTN.addEventListener('click',Cancel)
    function Valider(e){
        e.preventDefault();
        var Name=document.getElementById('Name').value;
        var Categ=document.getElementById('Categorie').value;
        var Desc=document.getElementById('Description').innerText;
        var Price=document.getElementById('Price').value;
        if(Name==null || Desc==null || Categ==null || Price==null)
        {
            alert('Tous Les Champs Sont Obligatoires !');
        }
        else{
                var Element={Name:Name,Categorie:Categ,Desc:Desc,Price:Price,}
                // console.log('Element : ',Element)
                // var xhttp=new XMLHttpRequest();
                // xhttp.open('POST','/Food_Edit',true);
                // xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
                // xhttp.send(JSON.stringify(Element))
                document.getElementById('form').submit()
        }
    }
    function Cancel(e)
    {
        e.preventDefault();
        
        window.location.replace('/Admin')
    }

}