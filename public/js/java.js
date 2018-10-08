function fun(){
    var table=document.getElementById("b");
    var subtotal=0.0;
    var tax=0.0;
    var total=0.0;
    for(var i = 2; i < table.rows.length; i++)
    {
        subtotal  = subtotal + (parseFloat(table.rows[i].cells[2].innerHTML) * parseFloat(table.rows[i].cells[3].innerHTML));
        tax= subtotal*0.1;
        total=tax+subtotal;
        document.getElementById("t1").value= subtotal;
        document.getElementById("t2").value= tax;
        document.getElementById("t3").value= total;
        table.rows[i].cells[1].innerHTML = parseFloat(table.rows[i].cells[1].innerHTML) - parseFloat(table.rows[i].cells[3].innerHTML);
    

    }
        
}