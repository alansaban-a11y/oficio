const CONTACT="alansaban@gmail.com";
const scripts={
candidato:[
"¿Cómo te llamás? Contame en criollo a qué te dedicás y qué buscás ahora.",
"¿Dónde estás y cómo te gustaría laburar?",
"Contame 2 o 3 laburos: qué hacías de verdad, sin bullet points de CV.",
"¿Cuánto necesitás cobrar, neto, para que valga la pena moverte? Un número, en la moneda que pienses.",
"¿Qué idiomas hablás y con qué nivel real? Tipo: ¿podés tener una call en inglés sin colgarte?",
"¿Qué no aceptás bajo ningún punto? Horario, industria, oficina, lo que sea.",
"CONFIRM"
],
empleador:[
"¿Qué empresa sos y quién sos vos ahí — founder, HR, hiring manager?",
"¿A quién necesitás y para qué? No el título: la tarea real del primer mes.",
"¿Cómo es el laburo: desde dónde y de qué forma?",
"¿Cuál es el rango que vas a pagar, en serio? Sin rango no publicamos el rol. Así funciona esto.",
"¿Qué tiene que haber hecho sí o sí esta persona? Una o dos cosas, no una lista de 15.",
"¿Qué te hace decir que no apenas lo ves?",
"¿Para cuándo necesitás a alguien laburando?",
"CONFIRM"
]
};
const hasNumber=/\d/;
const hasModality=/remoto|híbrid|hibrid|presencial|oficina|home office|desde casa/i;
let role=null,step=0,answers=[],waitingMoney=false,closed=false,placeFollow=false,modeFollow=false,askContact=false;
const gate=document.getElementById("gate");
const chat=document.getElementById("chat");
const log=document.getElementById("log");
const form=document.getElementById("form");
const inp=document.getElementById("inp");
document.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>start(btn.dataset.role)));
document.getElementById("back").addEventListener("click",reset);
function add(text,who){const d=document.createElement("div");d.className="msg "+who;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight}
function reset(){role=null;closed=false;askContact=false;gate.classList.remove("hidden");chat.classList.add("hidden");log.innerHTML=""}
function start(r){role=r;step=0;answers=[];waitingMoney=false;closed=false;placeFollow=false;modeFollow=false;askContact=false;gate.classList.add("hidden");chat.classList.remove("hidden");log.innerHTML="";add(scripts[role][0],"bot");inp.focus()}
function moneyStep(){return step===3}
function recap(){if(role==="candidato")return "Perfil corto, decime si te representa:\n\n• A qué te dedicás: "+(answers[0]||"—")+"\n• Dónde / cómo: "+(answers[1]||"—")+"\n• Hecho: "+(answers[2]||"—")+"\n• Piso: "+(answers[3]||"—")+"\n• Idiomas: "+(answers[4]||"—")+"\n• No acepta: "+(answers[5]||"—")+"\n\nSi está bien, escribí OK. Si no, decime qué cambio.";return "Brief corto, ¿publico así?\n\n• Empresa / vos: "+(answers[0]||"—")+"\n• Rol real: "+(answers[1]||"—")+"\n• Modalidad: "+(answers[2]||"—")+"\n• Plata: "+(answers[3]||"—")+"\n• Innegociable: "+(answers[4]||"—")+"\n• Descarte: "+(answers[5]||"—")+"\n• Para cuándo: "+(answers[6]||"—")+"\n\nEscribí OK para entrar al pool. Sin OK no se publica."}
function nextBot(){step+=1;const q=scripts[role][step];if(q==="CONFIRM")add(recap(),"bot");else add(q,"bot")}
function saveAndMail(contact){const payload={role,answers,contact,at:new Date().toISOString()};const list=JSON.parse(localStorage.getItem("homelabor_pool")||"[]");list.push(payload);localStorage.setItem("homelabor_pool",JSON.stringify(list));const body=encodeURIComponent("Nuevo "+role+"\n\n"+JSON.stringify(payload,null,2));window.location.href="mailto:"+CONTACT+"?subject="+encodeURIComponent("Homelabor "+role)+"&body="+body}
form.addEventListener("submit",e=>{e.preventDefault();const text=inp.value.trim();if(!text||(closed&&!askContact))return;inp.value="";add(text,"me");if(askContact){askContact=false;closed=true;saveAndMail(text);add("Quedó guardado. Se abre el mail para mandarlo a Homelabor.","sys");return}if(scripts[role][step]==="CONFIRM"){if(/^ok\b|sí|si\b|dale|perfecto|así|asi/i.test(text)){askContact=true;add("Última: un mail o un WhatsApp para avisarte si hay fit.","bot")}else add("Dale, decime qué cambio y lo reescribo. Cuando esté, OK.","bot");return}if(moneyStep()&&!hasNumber.test(text)){if(!waitingMoney){waitingMoney=true;add("Acá no armamos matches sin plata clara. Un número — rango vale.","bot");return}closed=true;add("Sin número no entra al pool.","sys");return}if(role==="candidato"&&step===1&&!placeFollow&&!hasModality.test(text)){answers[1]=text;placeFollow=true;add("¿Remoto, híbrido o presencial? ¿Y solo en tu país o también afuera?","bot");return}if(role==="candidato"&&step===1&&placeFollow){answers[1]=(answers[1]?answers[1]+" — ":"")+text;waitingMoney=false;nextBot();return}if(role==="empleador"&&step===2&&!modeFollow&&!hasModality.test(text)){answers[2]=text;modeFollow=true;add("¿Remoto, híbrido o presencial? ¿Y desde qué países aceptás gente?","bot");return}if(role==="empleador"&&step===2&&modeFollow){answers[2]=(answers[2]?answers[2]+" — ":"")+text;waitingMoney=false;nextBot();return}answers[step]=text;waitingMoney=false;nextBot()});
