///group
const addGroup = document.querySelector('#listGroup')
const buttonShow =document.querySelector('#showGroup')//start показіваем группу по клику
buttonShow&&
buttonShow.addEventListener('click', async function(){
    const groupId = inputGroup.value
    let idxField=0;
    if(groupId.length){
        const response = await axios.post(`/group/show/`,groupId.trim()) //ЗАПРОС показать группу
       
        if(response.data){
            const html = response.data.map((s,i)=>{
                idxField++
                return `
                <tr class="borderBottomNone">
                 <td name="number" class="numberStudent">
                     ${i+1}
                </td>
                <td>
                   <div class="input-field">
                      <input name="surname${i=i>0?i:''}" placeholder="Введите Фамилия" type="text" class="validate field${i}" value=${s.surname} required=${i===0&&true}>
                      <span class="helper-text" data-error="Введите Фамилию"></span>
                   </div>
                </td>
                <td>
                    <div class="input-field">
                      <input  name="name${i=i>0?i:''}" placeholder="Введите Имя" type="text" class="validate field${i}" value=${s.name} required=${i===0&&true}>
                      <span class="helper-text" data-error="Введите Имя"></span>
                   </div>
                </td>
                <td >
                    <div class="input-field">
                      <input name="fname${i=i>0?i:''}" placeholder="Введите Отчество" type="text" class="validate field${i}" value=${s.fname} required=${i===0&&true}>
                      <span class="helper-text" data-error="Введите Отчество"></span>
                   </div>
                </td> 
             </tr>
                    `
            })
            addGroup.innerHTML=`
            <form id="groupList" action="/group/add" method="POST">

            <table>
         
               <thead>
                  <tr>
                     <th>Номер</th>
                     <th>Фамилия</th>
                     <th>Имя</th>
                     <th>Отчество</th>
                  </tr>
               </thead>
         
               <tbody>
                        ${html}
                        <tr class="borderBottomNone">
                     <td name="number" class="numberStudent">
                          ${idxField+1}
                     </td>
                     <td>
                        <div class="input-field">
                           <input name="surname${idxField}" placeholder="Введите Фамилия" type="text" class="validate field${idxField}" >
                           <span class="helper-text" data-error="Введите Фамилию"></span>
                        </div>
                     </td>
                     <td>
                         <div class="input-field">
                           <input  name="name${idxField}" placeholder="Введите Имя" type="text" class="validate field${idxField}" >
                           <span class="helper-text" data-error="Введите Имя"></span>
                        </div>
                     </td>
                     <td >
                         <div class="input-field">
                           <input name="fname${idxField}" placeholder="Введите Отчество" type="text" class="validate field${idxField}" >
                           <span class="helper-text" data-error="Введите Отчество"></span>
                        </div>
                     </td>
                  </tr>
               </tbody>
         
            </table>
         
            <input type="hidden" name="groupId" value=${groupId.trim()}>
            <button id="addStudents" class="btn btn-primary" style="margin:0px 5rem;">Добавить студентов</button>
         </form>
            `
        }
        else{
            window.M.toast({html:"Данной группы НЕТ добавьте группу"})
            addGroup.innerHTML=`
            <form id="groupList" action="/group/add" method="POST">

            <table>
         
               <thead>
                  <tr>
                     <th>Номер</th>
                     <th>Фамилия</th>
                     <th>Имя</th>
                     <th>Отчество</th>
                  </tr>
               </thead>
         
               <tbody>
                  <tr class="borderBottomNone">
                     <td name="number" class="numberStudent">
                          1
                     </td>
                     <td>
                        <div class="input-field">
                           <input name="surname" placeholder="Введите Фамилия" type="text" class="validate field0" required>
                           <span class="helper-text" data-error="Введите Фамилию"></span>
                        </div>
                     </td>
                     <td>
                         <div class="input-field">
                           <input  name="name" placeholder="Введите Имя" type="text" class="validate field0" required>
                           <span class="helper-text" data-error="Введите Имя"></span>
                        </div>
                     </td>
                     <td >
                         <div class="input-field">
                           <input name="fname" placeholder="Введите Отчество" type="text" class="validate field0" required>
                           <span class="helper-text" data-error="Введите Отчество"></span>
                        </div>
                     </td>
                  </tr>
               </tbody>
         
            </table>
            <div class="row">
            <div class="col s6 ">
            <input type="password" name="password" placeholder="Введите пароль для входа в кабинет группы" class="validate" required>
            <input type="hidden" name="groupId" value=${groupId.trim()}>
            <button id="addStudents" class="btn btn-primary" style="margin:0px 5rem;">Добавить студентов</button>
            </div></div>
            
         </form>
         `
        }
    }

///end показываем группу

const $group = document.querySelector('#groupList')

if($group){
    let idx=1;
    let name={
        surname:'surname',
        name:'name',
        fname:'fname'
    }
    let value={
        surname:'',
        name:'',
        fname:''
    }
   
    if(idxField>0){
        idx=idxField+1
        name={
            surname:`surname${idxField}`,
            name:`name${idxField}`,
            fname:`fname${idxField}`
        }
    }

    $group.addEventListener('keyup',event=>{
            if(event.target.name===name.surname||event.target.name===name.name || event.target.name===name.fname){
                switch(event.target.name){
                    case name.surname: value.surname=event.target.value; break;
                    case name.name: value.name = event.target.value; break;
                    case name.fname: value.fname = event.target.value; break;
                }
            }
           
            if(value.surname.length && value.name.length && value.fname.length){
               
            const html= `          
                            <td name="number" class="numberStudent">
                                    ${idx+1}
                            </td>
                            <td>
                                <div class="input-field">
                                <input name="surname${idx>0 && idx}" placeholder="Введите Фамилия" type="text" class="validate field${idx}" >
                                <span class="helper-text" data-error="Введите Фамилию"></span>
                                </div>
                            </td>
                            <td>
                                <div class="input-field">
                                <input  name="name${idx>0 && idx}" placeholder="Введите Имя" type="text" class="validate field${idx}">
                                <span class="helper-text" data-error="Введите Имя"></span>
                                </div>
                            </td>
                            <td>
                                <div class="input-field">
                                <input name="fname${idx>0 && idx}" placeholder="Введите Отчество" type="text" class="validate field${idx}">
                                <span class="helper-text" data-error="Введите Отчество"></span>
                                </div>
                            </td>
                           
                         `
            const tr = document.createElement('tr')
            tr.className="borderBottomNone"
            tr.innerHTML=html
            $group.querySelector('tbody').appendChild(tr)
             value={
                surname:'',
                name:'',
                fname:''
                }
             name={
                    surname:'surname'+idx,
                    name:'name'+idx,
                    fname:'fname'+idx
                }
                idx++;

            }
    })


    addStudents.addEventListener('click',()=>{
        for(let i=0;i<idx;i++){

            const field={
                name:'',
                surname:'',
                fname:''
            }

           const fields=document.querySelectorAll(`.field${i}`)
           
           fields.forEach((e,ind)=>{
               switch(ind){
                   case 0:field.name = e.value; break;
                   case 1:field.surname = e.value; break;
                   case 2:field.fname = e.value; break;
               }
           })

           if((field.name.length && field.surname.length && field.fname.length) || (field.name.length<1 && field.surname.length<1 && field.fname.length<1)){
               if(idx>1)fields.forEach(e=>e.required=false)
           }else{
                fields.forEach(e=>e.required=true)
           }

        }
    })

}
})

/////////////////end group