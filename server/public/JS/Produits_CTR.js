if(document.readyState =='loading'){
    document.addEventListener('DOMContentLoaded',ready)
}else{
    ready()
}
console.log("Hello")
function ready() {

    console.log('PROD READY FUNC');
    var Produits_Create=document.getElementById('Create-Food');
    var Produits_Delete=document.querySelectorAll('.delete');
    var Produits_Edit=document.querySelectorAll('.edit');
    Produits_Create.addEventListener('click',Valider)

    for (var i = 0; i < Produits_Delete.length; i++) {
        Produits_Delete[i].addEventListener('click',food_delete)
    }


    for (var i = 0; i < Produits_Edit.length; i++) {
        Produits_Edit[i].addEventListener('click',food_update)
    }
    

    function food_update()
    {
        // var Edited_Id=this.id
        // alert("You Clicked : "+Edited_Id)
        // var PopUp=" <div class='Edit-BG'><div class='popup-edit  container' id='popup_edit'><div class='Edit-Info'><span class='close-popup-edit' Onclick='Close_Edit_Food()'>+</span><div ><div class='image-section' ><div class='Image-edit-food' style='background: url(images/1620840884907-FOOD-IMGimage.jpeg) top center;'></div><label for='Image-Update'><i class='fas fa-camera img-cam'></i></label><input type='file' name='Image-Update' id='Image-Update' style='display: none;'>    </div><div><input type='text' id='Name-edit-food' class='Name-edit-food' placeholder='Name'></div><div><input type='text' id='Categorie-edit-food' class='Categorie-edit-food' placeholder='Categorie'></div><div><textarea name='Desc-edit-food' id='Desc-edit-food' placeholder='Description' cols='30' rows='10'></textarea></div><div><input type='number' name='Price-edit-food' id='Price-edit-food' placeholder='Price' min='5'></div> <!-- <div><input type='file' name='' id=''></div> --><div class='button-section'><button type='submit' class='Cancel-edit-food' id='Cancel-edit-food'>Cancel</button> <button class='Update-edit-food' id='Update-edit-food' type='submit'>Update</button></div></div></div></div></div>"
        // // document.createElement(PopUp)
        // document.getElementsByClassName('Globale')[0].innerHTML+=PopUp
        
    }

    function food_delete()
    {
        console.log('Delete Prod');
           var answer = confirm("do you want to delete?")
            if (answer){
                var id=this.id;
                console.log('delete id is :',id)
                const delete_id={id:id}
                var xhttp=new XMLHttpRequest();
                xhttp.open('POST','/delete_food',true);
                console.log(delete_id)
                xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
                xhttp.send(JSON.stringify(delete_id))
            }
            
    }

    function Valider()
    {
        var Name=document.getElementById('Name').value;
        var categorie=document.getElementById('Categorie').value;
        var Desc=document.getElementById('Desc').innerText;
        var price=document.getElementById('Price').value;
        var IMAGE_PATH=document.getElementById('FOOD-IMG')
        if(Name=='' ||  categorie=='' || price=="")
        {
            alert('Tous Les Champs Sont Obligatoires !');
        }
        else{
            if(price<5)
            {
                alert('Price Must be >5 DH')
            }
            else{
                // const Prod_Info={Name:Name,Categorie:categorie,Description:Desc,Price:price};
                // alert(JSON.stringify(Prod_Info))
                // var xhttp=new XMLHttpRequest()
                // xhttp.open('POST','Create_Food',true);
                // xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
                // xhttp.send(JSON.stringify(Prod_Info))

                // post('/Create_Food',Prod_Info)
               document.getElementById('form').submit()
                      
            }
        }
//         function post(path, params, method='post') {

//         // The rest of this code assumes you are not using a library.
//         // It can be made less verbose if you use one.
//         const form = document.createElement('form');
//         form.method = method;
//         form.action = path;

//         for (const key in params) {
//             if (params.hasOwnProperty(key)) {
//             const hiddenField = document.createElement('input');
//             hiddenField.type = 'hidden';
//             hiddenField.name = key;
//             hiddenField.value = params[key];

//             form.appendChild(hiddenField);
//             }
//         }

//         document.body.appendChild(form);
//         form.submit();
//      }
    }
}