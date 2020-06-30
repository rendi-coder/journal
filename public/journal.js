
if(window.location.pathname==="/journal"||window.location.pathname==="/journal/upload"){
    path='/journal/getAttendance/'
    const day_of_the_week=document.querySelector('#day_of_the_week')
    if(day_of_the_week){
    
    axios.post(path,day_of_the_week.textContent)
    .then((response)=>{
    
  
    var elems = document.querySelectorAll('select');
    
    let idx=0;
    let i=0;
        
    elems.forEach((e)=>{
        if(response.data.length){
        switch(idx){
            case 0:e.value=response.data[i].first; break;
            case 1:e.value=response.data[i].second;break;
            case 2:e.value=response.data[i].third;break;
            case 3:e.value=response.data[i].fourth;break;
        }
        idx++;
        if(idx===4){
            idx=0;;
            i++;
        }
        }else{
            switch(idx){
                case 0:e.value='minus'; break;
                case 1:e.value='minus';break;
                case 2:e.value='minus';break;
                case 3:e.value='minus';break;
            }
            idx++;
            if(idx===4){
                idx=0;;
                i++;
            }
        }
    })

    })
    }

    ///Загрузка с файла)
    const loadFile = document.querySelector('#addFromFile')

    const file = document.querySelector('#attendanceFile')
    file.addEventListener('change',(e)=>{
        const candidate=file.value.split('.').reverse()[0]==="txt"
        if(candidate){
            loadFile.disabled=false
        }else{
            window.M.toast({html:"Необходимо выбрать файл с посещаемостью студентов"})
            file.value=''
            loadFile.disabled=true
        }
    })


    //end Загрузка с файла

}

      
  
    