//import * as MTalent from "./talentManangement.js";

const TALENT_PATH = "data/talent.xml";
const NAME_TALENT_PATH = "data/name_talent.xml";
var AVAILABLE_POINTS = 40;

var styles = ["defender", "berserker", "sorcerer", "cleric", "assassin"];
var default_style = "defender";
var atualizado = false;
var tooltip_talent = "";



window.onload = init;

function init(){
    //createPanelStyles();
    loadStyles();
    TalentXMLtoJsonObj();
    nameTalent();
    doAttributesSkill(default_style);
    doTooltipTalent();
    changeTab(default_style);
    Events();
    
}

function Events()
{
    //clearAllEvents();
    selectTabEvents();
    clickEvents();
    mouseEvents();
}

function selectTabEvents(){

    var evento = document.getElementById("list-tabs").getElementsByTagName("a");

    for(var i = 0; i < evento.length; i++){
        evento[i].addEventListener("click",function(){
            var target  = this.getAttribute("target");
                    
            changeTab(target);
            updateSkillPoints(target);
        }, false);
    }
}

function addTalentPoints(){
    //console.log(this);
    var button = this.parentElement;
    var classe = button.getAttribute("classe");
    var skill = talentdata[classe][button.id];
    var maxpoints = Object.keys(skill).length-1;

    if(skill.curpoints < maxpoints && AVAILABLE_POINTS > 0){
        AVAILABLE_POINTS--;
        skill.curpoints++;
        talentdata[classe].points++;
    }
    updateMasteryTalentPoints(classe);
    updateSkillPoints(classe);
}


function updateThisMouseMoveEvent()
{
    var parent = this.parentElement;
    //console.log(this.parentElement);
    
    if(parent && (tooltip_talent != parent.id || tooltip_talent == "")){
        // console.log(`estou na skill ${this.parentElement.id}`);
        showToolTip(parent.id);
        tooltip_talent = parent.id;
    }
}

function updateThisMouseOutEvent()
{   
    //console.log(`saindo da skill ${tooltip_talent}`);
    hideTooltTip();
    tooltip_talent = "";
}

function clickEvents()
{
    var inframe = document.getElementById("tab-skills").getElementsByClassName("add-button");
    
    for(var event of inframe)
    {
        //console.log(event)
        event.addEventListener("click",addTalentPoints, false);

        event.addEventListener("mousemove", function(){ 
            this.style.objectPosition = "-20px 0px";
        }, false);
    
        event.addEventListener("mouseout", function(){ 
            this.style.objectPosition = "0px 0px";
        }, false);
    }
    
    //console.log(inframe.length);
}

function clearAllEvents()
{
    var oldframe = document.getElementById("frame");
    var newframe = oldframe.cloneNode(true);

    oldframe.parentElement.replaceChild(newframe, oldframe);
}

function updateThisMouseEvent(e)
{
    e.addEventListener("mousemove",updateThisMouseMoveEvent, false);
    e.addEventListener("mouseout",updateThisMouseOutEvent, false);
}

function mouseEvents()
{
    var obj = [];
    var containerTalent = document.querySelectorAll("[class=skill-icon]");
    var containerPoints = document.querySelectorAll("[class=skill-points]");
    var containerTooltip = document.querySelectorAll("[name=tooltip]");

    obj.push(containerTalent);
    obj.push(containerPoints);
    obj.push(containerTooltip);

    for(var element of obj){
        //var element;
        for(var talent of element)
            updateThisMouseEvent(talent);
    }   
}


function HideAddButtons()
{
    var addbottoes = document.querySelectorAll("[TalentType=skill");

    for(var i = 0; i < addbottoes.length; i++)
    {
        //console.log(addbottoes[i]);
        var addbtncls = addbottoes[i].querySelector("[class=add-button]");
        addbtncls.style.visibility = "hidden";
    }
}

function updateSkillPoints(classe)
{
    //console.log(classe);
    var style               = document.querySelectorAll(`[classe=${classe}]`);
    var style_points        = document.getElementById(`sp_${classe}`);
    var used_points         = document.getElementById("sp_used");
    var available_points    = document.getElementById("sp_available");

    style_points.innerText      = talentdata[classe].points;
    sp_used.innerText           = countUsedTalentsPoints();
    available_points.innerText  = AVAILABLE_POINTS;

    if(AVAILABLE_POINTS == 0)
        HideAddButtons();

    for(var i = 0; i < style.length;i++){
        var talent              = style[i].id;
        var skill               = getMainTalent(talent);

        if(skill)
        {
            var maxpoints           = Object.keys(skill).length-1;
            var curpoints           = style[i].querySelector("#skill-points-cur");
            var mine                = style[i].querySelector("[class=add-button]");
            var img                 = style[i].querySelector(".skill-icon");
            var btn                 = style[i].querySelector(".add-button");
            //if(talent == "10220" || talent == "10221" || talent == "10222")
                //console.log("ta aqui o talent "+ talent);
            if(talent == null)
                break;
            if(talentNeedPoints(talent) > talentdata[classe].points )
            {
                //if(talent == "10221")
                    //console.log("primeiro if");
                if(!IHaveThisTalent(talent))
                    img.style.filter = "grayscale(100%)";
                else if(thisTalentIsMastery(talent))
                    img.style.filter = "grayscale(0)";
                
                if(btn)         btn.style.visibility = "hidden";
            }
            else if(IHaveNeedTalentOfThisTalent(talent)){
                //if(talent == "10221")
                    //console.log("2 if");
                var m_talent = getMainTalent(talent);
                img.style.filter = "grayscale(0)";
                if(btn)         btn.style.visibility = "visible";
            }
            else{
                //if(talent == "10221")
                    console.log(`this talent need atention ${talent}`);
            }     
            
            if(AVAILABLE_POINTS == 0){
                if(btn)         btn.style.visibility = "hidden";
            }
            curpoints.innerText = skill.curpoints;
            if(parseInt(skill.curpoints) == parseInt(maxpoints)){
                //muda a cor quando atinge pontos maximo e oculta o botao de incremento
                curpoints.style.color = "blanchedalmond"; 
                if(m_talent[talent].TalentType != "mastery")
                    mine.style.visibility = "hidden";
            }
        }
    } 
}
function unselectAllTabs()
{
    for(var style of styles){
        document.getElementById(`${style}-tab`).className = "none-selected";
    }
}

function hideAllFrameTabs()
{
    for(var style of styles)
    {
        var tabFrameActive = document.getElementById(style);
        var tabFrameMastery = document.getElementById(`${style}-mastery`);
        
        tabFrameActive.classList.add("invisible");
        tabFrameMastery.classList.add("invisible");
    }
}
function HideAllContainerHeaderStyles()
{
    for(var style of styles)
    {
        var contHeader = document.getElementById(`container-header-${style}`);
        contHeader.className = "invisible";
    }
}
function changeTab(target){
    
    hideAllFrameTabs();
    unselectAllTabs();
    HideAllContainerHeaderStyles();
    var tabFrameActive = document.getElementById(target);
    var tabFrameMastery = document.getElementById(`${target}-mastery`);
    var tab = document.getElementById(`${target}-tab`);
    var contHeader = document.getElementById(`container-header-${target}`);

    tab.className = "selected";
    tabFrameActive.classList.remove("invisible");
    tabFrameMastery.classList.remove("invisible");
    contHeader.classList.remove("invisible");
    updateSkillPoints(target);
}



function changeIconPath(changeIconPath)
{
    changeIconPath = changeIconPath.replace("Data/Interface/icon/", "img/");
    return changeIconPath;
}

function doAttributesSkill()
{
    for(var j = 0; j < styles.length; j++){
        var search = `[classe=${styles[j]}]`;
        var skills = document.querySelectorAll(search);

        for(var i = 0; i < skills.length;i++)
        {
            var nskill          = skills[i].getAttribute("id");
            var style           = styles[j];
            var o_talent        = getTalent(nskill);
            if(o_talent){
                //console.log("erro "+style+"  "+nskill);
                var count           = Object.keys(getMainTalent(o_talent.id)).length - 1; //ainda ver isso
                var curpoints       = o_talent.curpoints;
                
                skills[i].querySelector("#img_icon_"+nskill).src        = o_talent.icon;
                skills[i].querySelector("#skill-points-tot").innerText  = count;
                skills[i].querySelector("#skill-points-cur").innerText  = curpoints;
            }
            else console.log("erro "+style+"  "+nskill);
        }
    }
}

function loadStyles(){
     
    var AcPassive           = document.getElementById("active_passive_container");
    var container_mastery   = document.getElementById("mastery_container");
    var linha               = document.createElement("div"); 
    var cSkill              = document.createElement("div")
    var iconImg             = document.createElement("img");
    var nimg                = document.createElement('img');
    var skillpoints         = document.createElement("span");
    var curpoints           = document.createElement("span");
    var barpoints           = document.createElement("span");
    var totpoints           = document.createElement("span");

    //span atributos de skill point
    skillpoints.setAttribute("class", "skill-points");
    curpoints.setAttribute("id", "skill-points-cur");
    totpoints.setAttribute("id", "skill-points-tot");
    //curpoints.innerText = "0";
    barpoints.innerText = "/";
    //totpoints.innerText = "5";
    skillpoints.appendChild(curpoints.cloneNode(true));
    skillpoints.appendChild(barpoints.cloneNode(true));
    skillpoints.appendChild(totpoints.cloneNode(true));

    //atributos imagem
    iconImg.setAttribute("class", "skill-icon");
    iconImg.setAttribute("id", "skill-icon-id");
    //atributos imagem botao de adicao
    nimg.setAttribute('src','img/def_addbuttonLarge.png');
    nimg.setAttribute('class','add-button');

    //atributos linha
    linha.setAttribute('class', 'linha');

    //atributos skill
    cSkill.setAttribute('class','container-skills-hide');
    cSkill.setAttribute('name', 'container-skills-name');
    cSkill.appendChild(nimg.cloneNode(true));
    cSkill.appendChild(iconImg.cloneNode(true));
    cSkill.appendChild(skillpoints.cloneNode(true));

    //mastery
    var linhaPassive = linha.cloneNode(false);
    var cSkillPassive = cSkill.cloneNode(true);
    cSkillPassive.setAttribute("class", "container-skills-invisible");
    cSkillPassive.getElementsByClassName("add-button")[0].setAttribute("class","invisible");
    cSkillPassive.getElementsByClassName("skill-points")[0].setAttribute("class","invisible");

    //console.log(linha);
    //console.log(cSkillPassive.getElementsByTagName("img")[1]);

    for(var i = 0; i < 6; i++){
        linha.appendChild(cSkill.cloneNode(true));
        if(i < 2)
            linhaPassive.appendChild(cSkillPassive.cloneNode(true));
    }
    for(var j = 0; j  < styles.length; j++){
        //var style = document.querySelector("#"+styles[j]);
        //var stylePassive = document.querySelector("#"+styles[j]+"-passive");
        //var containerStyle = document.createElement("div");
        var style = document.createElement("div");
        var mastery = document.createElement("div");

        //containerStyle.setAttribute("id", `container_${styles[j]}`);
        style.setAttribute("id",styles[j]);
        style.setAttribute("class", "container-skills-frame");
        mastery.setAttribute("id",`${styles[j]}-mastery`);
        mastery.setAttribute("id",`${styles[j]}-mastery`);

        for(var h = 0; h < 7; h++){
            style.appendChild(linha.cloneNode(true));
            mastery.appendChild(linhaPassive.cloneNode(true));
        }
        //containerStyle.appendChild(style.cloneNode(true));
        //containerStyle.appendChild(mastery.cloneNode(true));
        AcPassive.appendChild(style.cloneNode(true));
        container_mastery.appendChild(mastery.cloneNode(true));
        //oculta algumas colunas idntifica seus atributos
        organizeIconsPositions(styles[j]);
    }
}

function organizeIconsPositions(style)
{   
    //set column icons hide
    var temp = stylestalent[style].skill;
    var containersPanel = document.querySelector(`#${style}`);
    var containers = containersPanel.querySelectorAll('div[name="container-skills-name"]');


    for(var skill in temp)
    {
        var key = temp[skill];
        //console.log("key "+key+", skill "+skill);
        containers[key].setAttribute("class", "container-skills");
        containers[key].setAttribute("classe", style);
        containers[key].setAttribute("TalentType", "skill");
        containers[key].id = skill;
        containers[key].querySelector("#skill-icon-id").id = "img_icon_"+skill;
    }

    temp = stylestalent[style].mastery;
    containersPanel = document.querySelector("#"+style+"-mastery");
    containers = containersPanel.querySelectorAll('div[name="container-skills-name"]');

    for(var skill in temp)
    {
        var key = temp[skill];
        //console.log("key "+key+", skill "+skill);
        containers[key].setAttribute("class", "container-skills");
        containers[key].setAttribute("classe", style);
        containers[key].setAttribute("TalentType", "mastery");
        containers[key].id = skill;
        containers[key].querySelector("#skill-icon-id").id = "img_icon_"+skill;
    }

}
