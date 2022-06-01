
function doThisTalentToolTip(talent)
{
    if(!talent)   return;
    var m_tooltip;

	if(talent.rank > 1){
		m_tooltip = doThisTalentToolTip(talent.id -1);
		console.log(m_tooltip);
	}
    m_tooltip =`<div id="${talent.id}_tooltip" name="tooltip" class="invisible">
                    <div class="tool_img">
                        <img src="${talent.icon}">
                    </div>
                    <div class="tool_header" >
                        <p class="tool_name">${talent.name}`
    if(talent.rank > 1)
		m_tooltip += ` ${talent.rank}`
                        m_tooltip += `</p>
                            <p class="tool_style">${talent.style} Style  <a class="right tool_attribs">${ capitalizeFirstLetter(talent.Category)}/ ${ capitalizeFirstLetter(GetTalentType(talent))}</a></p>
                        </div>
                        <div class="tool_desc row">
                            <p>${talent.desc}</p>
                        </div>`
                        if(talent.STACost || talent.CoolTime || talent.stamine){
                            m_tooltip += `<div class="row">`
                            if(talent.STACost)          m_tooltip +=`<p>Stamine Cost <i class="green">${talent.STACost}</i></p>`
                            if(talent.CoolTime)         m_tooltip += `<p>Cooldown <i class="green">${talent.CoolTime}</i></p>`
                            if(talent.stamine)          m_tooltip += `<p>Effects <i class="green">${talent.stamine}</i></p>`
                            m_tooltip += `</div>`
                        }
                        if(talent.ModHPMax || talent.ModSTAMax){
                            m_tooltip += `<div class="row">
                                <p>Additional Stats</p>`
                            if(talent.ModHPMax)         m_tooltip += `<p class="indent">Max Health <i class="green">${talent.ModHPMax}</i></p>`
                            if(talent.ModSTAMax)        m_tooltip += `<p class="indent">Max Stamina <i class="green">${talent.ModSTAMax}</i></p>`
                            m_tooltip += `</div>`
                        }
                        if(talent.style || talent.TNeed_StyleTP){
                        m_tooltip += `<div class="row">
                            <p>Requirements</p>`
                            if(talent.style)            m_tooltip += `<p class="indent">Style Mastery: <i class="green">${talent.style}</i></p>`
                            if(talent.TNeed_StyleTP)    m_tooltip += `<p class="indent">Skill Points Used: <i class="green">${talent.TNeed_StyleTP}</i></p>`
                        m_tooltip += `</div>`
                        }
                    m_tooltip += `</div>`;
    
    return m_tooltip;
}

/* function updateThisToolTipTalent(talent)
{
    console.log(`Atualizando talent ${talent}`);
    var m_talent = getTalentByNumberOfPoints(getMainTalent(talent).curpoints, talent);
    var cont_talent = document.querySelector(`[id=${talent}]`);
    var tooltip_rem = document.getElementById(`${talent}_tooltip`);
    var tooltip = createElementFromString(doThisTalentToolTip(m_talent.id));

    tooltip_rem.parentElement.removeChild(tooltip_rem);
    cont_talent.appendChild(tooltip.cloneNode(true));
    
    //Events();
} */

function doTooltipTalent()
{
    
    for(var j = 0; j < 2; j++){
        for(i = 0; i < styles.length; i++){
            var mTalent = j == 0 ? stylestalent[styles[i]].skill: stylestalent[styles[i]].mastery;
            for(var talent in mTalent){      
                var htmlTalent =  document.getElementById(talent);
                var mainTalent = getMainTalent(talent);
                //console.log(mainTalent);
                for(var childTalent in mainTalent){
                    //console.log(childTalent);
                    if(typeof(mainTalent[childTalent]) === 'object'){
                        var tooltipStr = doThisTalentToolTip(mainTalent[childTalent]);
                        var tooltip =  createElementFromString(tooltipStr);

                        htmlTalent.appendChild(tooltip.cloneNode(true));
                    }
                }
            }
            
        }
    }
}

function hideTooltTip()
{
    var tooltip = document.getElementsByClassName("tooltip");
    for(i = 0; i < tooltip.length; i++)
        tooltip[i].className = "invisible";
}

function showToolTip(talent)
{
    var rank= 1;
    if(!thisTalentHasNextRank(talent)){
        print("entrou")
        rank = 0;
    }
    var mTalent = getTalentByNumberOfPoints(getMainTalent(talent).curpoints+rank, talent);
    console.log(`${mTalent.id}, ${talent, rank}`);
    var tool_skill = document.getElementById(`${mTalent.id}_tooltip`);
    //console.log("recebe "+ talent);
    tool_skill.className = "tooltip";
}