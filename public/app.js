///////////timetable
if(window.location.pathname==="/timetable"){
 addTimeTable.addEventListener('click',function(){
   dayLesson=[
        ".mlessona",".mlessonb",".mlessonc",".mlessond",
        ".tlessona",".tlessonb",".tlessonc",".tlessond",
        ".wlessona",".wlessonb",".wlessonc",".wlessond",
        ".thlessona",".thlessonb",".thlessonc",".thlessond",
        ".flessona",".flessonb",".flessonc",".flessond"
    ]

    for(let i=0;i<20;i++){
        
        let lesson=[];

        let lessonX=document.querySelectorAll(dayLesson[i])

        lessonX.forEach((e,i)=>{
            if(i===0){
                lesson.push({subject:e.value})
            }else{
                lesson[0].teacher=e.value
            }
        })



        if((lesson[0].subject.length>0 && lesson[0].teacher.length>0) || (lesson[0].subject.length<1 && lesson[0].teacher.length<1)){
            lessonX.forEach(node=>{
                node.required=false
            })
        }else{
            lessonX.forEach(node=>{
                node.required=true
            })
        }

    }

 })

}
/////////////////end timetable

/////////////////start datepicker
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(elems);
  });

const datePicker = document.querySelector('#datePicker')
const journal = document.querySelector('#MyJournal')

if(datePicker){

    datePicker.addEventListener('change',function(e){
        if(e.target.value){
            const date =new Date(e.target.value)
            const day = date.getDay();
            if(date>Date.now()){
                const text="Братан ты не сможешь заполнить журнал посещаемости ведь выбранный день еще не настал"
                window.M.toast({html:text})
                datePicker.value=''
                showTimeTable.disabled=true;
                return
            }
            if(day<1 || day>5){
                const text="Мы не учимся в субботу и воскресенье мы слишком молоды и ленивы"
                window.M.toast({html:text})
                datePicker.value=''
                showTimeTable.disabled=true;
            }else{
                showTimeTable.disabled=false;
            }
        }
    })

   const getDay=(day)=>{
        switch(day){
            case 1: return "Понедельник"
                case 2: return "Вторник"
                    case 3: return "Среда"
                        case 4: return "Четверг"
                            case 5: return "Пятница"
        }
    }
    
    showTimeTable.addEventListener('click',async()=>{
        const day = getDay(new Date(datePicker.value).getDay())
        const date=new Date(datePicker.value).toLocaleString('ru').split(' ')[0].replace(/\,/g, '')

        const {data} = await axios.post('/journal/timeDate/',datePicker.value)
      
        //меняем дату меняем посещаемость
        const response = await axios.post('/journal/getAttendance/',`${day} ${date}`)
        //console.log(response)
        
        var elems = document.querySelectorAll('select');
        
        let idx=0;
        let i=0;
        elems.forEach((e,index)=>{
            if(index>=2 && response.data.length){
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
            }else if(index>=2){
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
        //end
       
        const html = 
                  ` 
            <thead>
               
                <tr style="border: none;">
                <td>
                    <div class="input-field">
                        <input name="5lesson1" type="text" readonly value="Предмет:">
                        <span class="helper-text">Преподаватель:</span>
                    </div>
                </td>
                <td >
                    <div class="input-field">
                    <input name="5lesson1" placeholder="НЕТ пары" class="flessona" type="text" class="validate" readonly value="${data[0].subject}">
                    <span class="helper-text">${data[0].teacher}</span>
                    </div>
                </td>

                <td>
                    <div class="input-field">
                    <input name="5lesson1" placeholder="НЕТ пары" class="flessona" type="text" class="validate" readonly value="${data[1].subject}">
                    <span class="helper-text">${data[1].teacher}</span>
                    </div>
                </td>
                <td>
                    <div class="input-field">
                    <input name="5lesson1" placeholder="НЕТ пары" class="flessona" type="text" class="validate" readonly value="${data[2].subject}">
                    <span class="helper-text">${data[2].teacher}</span>
                    </div>
                </td>
                <td>
                    <div class="input-field">
                    <input name="5lesson1" placeholder="НЕТ пары" class="flessona" type="text" class="validate" readonly value="${data[3].subject}">
                    <span class="helper-text">${data[3].teacher}</span>
                    </div>
                </td>
            </tr>
            </thead>
            
    
        `
       const inputAt = document.querySelector('#attendanceFile')            
        
        journal.innerHTML = html
        day_of_the_week.innerHTML=`${day} ${date}`
        hiddenDate.value=`${day} ${date}`
        addFromFile.disabled=!inputAt.value && true
        hiddenDateFile.value=`${day} ${date}`
        addAttendance.disabled=false
       
    })

}   
////////////////end datepicker


//start SHOW journal LIST

 document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  });

//end  SHOW journal LIST




$(document).ready(function() {
    M.updateTextFields();
  });

//auth LOGIN error
if(window.location.pathname==="/auth/login"){
    const error = document.querySelector('#authError')
    if(error.value){
        window.M.toast({html:"Неверный логин или пароль"})
        error.value=''
    }            
}
