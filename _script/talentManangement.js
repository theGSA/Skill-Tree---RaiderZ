function TalentXMLtoJsonObj(){
    const talentXML     = loadXML(TALENT_PATH);//xmlData;//await xml.responseXML;
    const talents        = talentXML.getElementsByTagName("TALENT");
    var obj;
    
    for(var i = 0; i < talents.length; i++){
        var TalentLine = talents[i].getAttribute("TalentLine");
        var style = talents[i].getAttribute("Style");
        var TalentType = talents[i].getAttribute("TalentType");
        var id = talents[i].getAttribute("id");
        
        //console.log(TalentLine+" =="+thisTalentBelongToStylesTalent(TalentLine))
        if(thisTalentBelongToStylesTalent(TalentLine) || (thisTalentBelongToStylesTalent(id) && TalentType == "mastery")){

            if(!TalentLine)
                TalentLine = id;
            if(!talentdata[style]){
                talentdata[style] = {};
                talentdata[style].points = 0;
            }
            if(!talentdata[style][TalentLine]){
                talentdata[style][TalentLine] = {};
                talentdata[style][TalentLine].curpoints = 0;
            }       
            obj = talentdata[style][TalentLine][id] = {};

            obj.id              = talents[i].getAttribute("id");
            obj.name            = talents[i].getAttribute("name");
            obj.desc            = talents[i].getAttribute("desc");
            obj.style           = talents[i].getAttribute("Style");
            obj.rank            = talents[i].getAttribute("Rank");
            obj.TNeed_StyleTP   = talents[i].getAttribute("TNeed_StyleTP");
            obj.DescParam       = talents[i].getAttribute("DescParam");
            obj.icon            = changeIconPath(talents[i].getAttribute("icon"));
            obj.SkillType       = talents[i].getAttribute("SkillType");
			obj.Category		= talents[i].getAttribute("Category");
			obj.DamageType		= talents[i].getAttribute("DamageType");
            obj.TalentType      = talents[i].getAttribute("TalentType");
            obj.ENCost          = talents[i].getAttribute("ENCost");
            obj.STACost         = talents[i].getAttribute("STACost");
            obj.ModHPMax        = talents[i].getAttribute("ModHPMax");
            obj.ModENMax        = talents[i].getAttribute("EModENMax");
            obj.ModSTAMax       = talents[i].getAttribute("ModSTAMax");
            obj.CoolTime        = talents[i].getAttribute("CoolTime");
            obj.TNeed_Talent    = talents[i].getAttribute("TNeed_Talent");
            obj.TalentLine      = talents[i].getAttribute("TalentLine");
        }         
    }
    //doThisTalentToolTip();
    console.log(talentdata);
    //var mhson = JSON.stringify(styleSkills);
    //  mhson = JSON.stringify(styleSkills);console.log(mhson);
        //var mhson = JSON.stringify(styleSkills);

}

function thisTalentBelongToStylesTalent(talent)
{
    for(var m_style in stylestalent)
    {   
        for(var o_style in stylestalent[m_style])
        {
            for(var idskill in stylestalent[m_style][o_style])
            {
                if(talent == idskill)
                    return true;
            }
        }
    }
    return false;
}



function getTalent(talent)
{
    for(var classe_str in talentdata){
        var classe_obj = talentdata[classe_str];

        if(typeof(classe_obj) === 'object'){
            for(var skill_str in classe_obj){
                if(typeof(classe_obj[skill_str]) === 'object'){
                    var skill_obj = classe_obj[skill_str];
                    for(var skill in skill_obj){
                        if(skill == talent)
                            return skill_obj[skill];
                    }
                }
            }
        }
    }
}
function GetTalentType(talent) {
	if(talent.TalentType && talent.TalentType != "skill")
		return talent.TalentType;
	else if(talent.DamageType == "physic") 
		return "Active";
	else
		return talent.DamageType;
}
function PrintallTalent()
{
    for(var classe_str in talentdata){
        var classe_obj = talentdata[classe_str];

        if(typeof(classe_obj) === 'object'){
            for(var skill_str in classe_obj){
                if(typeof(classe_obj[skill_str]) === 'object'){
                    var skill_obj = classe_obj[skill_str];
                    for(var skill in skill_obj){
                        if(skill_obj[skill] && skill_obj[skill].TalentType != "mastery")
                            console.log(`"${skill}",`);
                    }
                }
            }
        }
    }
}

function updateMasteryTalentPoints(classe)
{
    var div_style = document.querySelector(classe);

    for(var skill in stylestalent[classe].mastery)
    {
        //console.log(skill);
        var m_talent = getMainTalent(skill);
        var str_talent = getTalentByNumberOfPoints(m_talent.curpoints+1,Object.keys(m_talent)[0]);
        if(str_talent){
            if(objlength(m_talent)-1 > m_talent.curpoints && str_talent.TNeed_StyleTP <= talentdata[classe].points){
                m_talent.curpoints++;
            }
        }
    }

}

function countUsedTalentsPoints()
{
    var count = 0;
    for(var i=0; i < styles.length;i++)
        count+= talentdata[styles[i]].points;

    return count;
}

function getNeedTalent(talent)
{
    if(!getTalent(talent))
        return null;
    return getTalent(talent).TNeed_Talent;
}

function getTalentByNumberOfPoints(points, talent)
{
    var t_atribute = getMainTalent(talent);
    for(var talent in t_atribute)
        if(parseInt(t_atribute[talent].rank) == parseInt(points))
            return t_atribute[talent];
    
    return null;
}
function IHaveNeedTalentOfThisTalent(talent)
{
    var n_talent = getNeedTalent(talent);
    if(!n_talent)
        return true;
    
    return IHaveThisTalent(n_talent);
}

function thisTalentIsMastery(talent)
{
    var isMastery = getTalent(talent).TalentType == "mastery" ? true: false;
    return isMastery;
}

function IHaveThisTalent(talent)
{
    if(talent)
    {
        //console.log(talent);
        var m_talent = getTalent(talent).TalentLine;

        if(m_talent){
            var t_skill = getMainTalent(m_talent);
            //console.log(t_skill);
            for (var a_skill in t_skill)
            {
                if(typeof(t_skill[a_skill]) === 'object'){
                    if(talent == a_skill && t_skill.curpoints >= parseInt(t_skill[a_skill].rank))
                        return true;
                }
            }
        }
    }
    return false;
}

function getMainTalent(talent)
{
    for(var classe_str in talentdata){
        var classe_obj = talentdata[classe_str];

        if(typeof(classe_obj) === 'object'){
            for(var skill_str in classe_obj){
                if(typeof(classe_obj[skill_str]) === 'object'){
                    var skill_obj = classe_obj[skill_str];
                    for(var skill in skill_obj){
                        if(skill == talent)
                            return skill_obj;
                    }
                }
            }
        }
    }
    return null;
}
function talentNeedPoints(talent)
{
    var t_skill = getMainTalent(talent);
   
    for(var a_skill in t_skill)
    {
        if(parseInt(t_skill[a_skill].rank) == parseInt(t_skill.curpoints)+1){
            t_skill = t_skill[a_skill];
            break;
        }    
    }
    if(!t_skill)
        return null;
    return t_skill.TNeed_StyleTP;
}

function nameTalent(xml)
{   
    var nTalent = loadXML(NAME_TALENT_PATH);
    var keys = nTalent.getElementsByTagName("STR");
    //console.log(styleSkills);
    
    for(var i=0;i < objlength(talentdata);i++)
    {
        var classe = talentdata[styles[i]];
        
        for(var idSkill in classe)
        {
            var cSkill = classe[idSkill];
            if(typeof(cSkill) === 'object')
            {
                for(var skill in cSkill)
                {
                    if(typeof(cSkill[skill]) === 'object'){
                        var name = nTalent.querySelector("[key=TALENT_NAME_"+skill+"]");
                        var desc = nTalent.querySelector("[key=TALENT_DESC_"+skill+"]");

                        cSkill[skill].name = name.getAttribute("string");
                        cSkill[skill].desc = formatDesc(desc.getAttribute("string"), cSkill[skill].DescParam);
                    }
                }
            }            
        }
    }
    //for(var classe in styles)
        //updateSkillPoints(styles[classe]);
    //console.log(styleSkills);
    //var mhson = JSON.stringify(styleSkills);
    //console.log(mhson);
   
}

function thisTalentHasNextRank(talent)
{
    var mTalent = getMainTalent(talent);

    if(mTalent.curpoints >= objlength(mTalent) - 1)
        return false;
    else
        return true;
}