var flangeBox = {};  //Used for context to coordinate between the functions.

/*This parses a JSON file with values for ASME flange tables, populates selectors accordingly
 * and adds listeners to detect value changes and the push of the submit buttons.  If the
 * selects are changed it enables the submit buttons and outputs the proper values in an
 * alert box.  It was designed using Jquery Mobile and Cordova.*/
(function(context) {	

	context.startLoad = function() {
		$(function() {
            //FastClick.attach(document.body);
        });
		
		$("#flange-send").click(function(){
			context.calcFlange();
		});
	
		$("#stud-send").click(function(){
			context.calcStud();
		});
		
		context.flangeSelClass = $(".flange-sel");
		
		context.sizeSel = $("#select-flange-size");
		context.rateSel = $("#select-flange-rating");
		context.studSel = $("#stud-select");
		
		
		$.getJSON("data/FlangeArrays.json").done(function(data){
			context.postLoad(data);
		});
	};
	
	//after the JSON is done loading this is called to run the rest of the setup.	
	context.postLoad = function(data) {
		context.data = data;
		context.popSelects();
		context.addSelectChange();
		
	};
	
	context.popSelects = function() {
		data = context.data;
		selectSize = context.sizeSel;
		selectRate = context.rateSel;
		selectStud = context.studSel;
		
		$.each(data.fSizes, function(i, value) {
	   		selectSize.append($('<option>').text(value + "\"").attr('value', value));
		});
		$.each(data.fRatings, function(i, value) {
	   		selectRate.append($('<option>').text(value + "#").attr('value', value));
		});
	
		studSizes = data.studSizes;
		studSizeOrd = data.studSizeOrdered;
		var studStatsOrdered = [];
		
		for(var i = 0; i < studSizeOrd.length; i++) {
			selectStud.append($('<option>').text(studSizeOrd[i] + "\"").attr('value', studSizeOrd[i] + "\""));
			studSizeOrdString = studSizeOrd[i].toString();
			//console.log(studSizeOrdString);
			studStatsOrdered[i] = [studSizes[studSizeOrdString]];
		} 
		
		context.studStatsOrdered = studStatsOrdered;
		context.sendBut = $("#flange-send");
		context.sendBut.prop('disabled', true);
		
		context.studBut = $("#stud-send");
                context.studBut.prop('disabled', true);
		context.addSelectChange();	
	};
	
	context.addSelectChange = function() {
		context.flangeSelClass.bind('change', function(){
			//console.log("change");
			context.updateSendButton();
		});
	};
	
	context.updateSendButton = function () {
		/*
		if(typeof(context.rateSel[0].selectedIndex) === 'undefined' ||
		typeof(context,studSel[0].selectedIndex) === 'undefined') { 
			console.log("shit is all undefined");
			return;
		}
		*/
		
                context.sendBut.prop('disabled', context.rateSel[0].selectedIndex == 0 || context.sizeSel[0].selectedIndex == 0)
		//context.sendBut.button("refresh");
		
                context.studBut.prop('disabled', context.studSel[0].selectedIndex == 0);
               // console.log(context.studSel[0].selectedIndex);
		//context.studBut.button("refresh");
	};
	
	context.calcStud = function () {  //called by stud only button 
		context.studSize = context.studSel.val().replace('"', '');
		context.studStats = context.getStudStats(context.studSize);
		//console.log("studSize is: " + context.studSize + ", studStats are: " + context.studStats); 
		context.displayStud(context.studStats);
	};
	
	context.displayStud = function(studStats){
		var studSize = context.studSize;
		studString = ("Stud Size: " + studSize + "\"");
		toolString = ("Wrench: " + studStats[0] + "\",   Drift Pin: " + studStats[1] + "\"");
		torqueString = ("B7 Torque: " + studStats[3] + " ft-lbs \nB7M Torque: " + studStats[2] + " ft-lbs");
		
		outString = (studString + "\n" +
			toolString + "\n" +
			torqueString);
		
		alert(outString);
	};
	
	context.calcFlange = function() {
		sSize = context.sizeSel;
		sRate = context.rateSel;
	
		rateInd = sRate[0].selectedIndex;  //flange rating select index
		context.rateVal = sRate.val();
		context.sizeVal = sizeVal = $(sSize).val();  //might not make global
		
		//Inside the $.each() callback above, you would do $.each(this.subaction, function() { alert(this.name); });, that would give you A, B, C, etc. - test it out here:
			
		context.flangeStats = context.getFStats(rateInd, sizeVal);
		//console.log("flange stats is defined and [0] is: " + context.flangeStats[0]);
		context.studStats = context.getStudStats(context.flangeStats[0]);
		//console.log("studStats is: " + context.studStats);
		context.displayFlange(context.flangeStats, context.studStats);
	};
	
	context.getFStats = function (rateIndex, sizeVal){
		var fStatArr = [
			0,  //First index in <select> is "rate" label
			context.data.fStats150,
			context.data.fStats300,
			context.data.fStats400,
			context.data.fStats600,
			context.data.fStats900,
			context.data.fStats1500
		];
		
		fStats = fStatArr[rateIndex];
		var statString = [];
		$.each(fStats, function(i, value){
			//console.log("checked: " + i + " against: " + sizeVal);
			if(i == sizeVal) {
				//console.log("getFstats returned: " + value);
				statString = value;
			}
		});
		return statString;
	};
	
	context.getStudStats = function (studSize){
		var retVal = [];
		$.each(context.data.studSizes, function(i, value) {
			if(i === studSize) {
				//console.log("got stud: " + value);
				retVal = value;
			}
			//console.log("Checking: " + studSize + " against: " + i + " getting: " + (studSize == i));
		});
		
		return retVal;
		//console.log("Should still be: " + context.torqueStats);
	};
	
	context.displayFlange = function(flangeStats, studStats) {
	//studStats = studSize: [wrench size, drift pin, b7m torque, b7 torque]
	//flangeStats = flangeSize: [studSize, studIndex, studCount, studLength] 
	
	flangeString = ("Flange Size: " + context.sizeVal + "\": " + context.rateVal + "#");
	studString = ("Studs: " + flangeStats[2] + " @ " + flangeStats[0] + "\" x " + flangeStats[3] + "\"");
	toolString = ("Wrench: " + studStats[0] + "\",   Drift Pin: " + studStats[1] + "\"");
	torqueString = ("B7 Torque: " + studStats[3] + " ft-lbs \nB7M Torque: " + studStats[2] + " ft-lbs");
	
	alert(flangeString + "\n" + 
		studString + "\n"
		+ toolString + "\n"
		+ torqueString);
	};
	
})(flangeBox);

$("#flange-page").bind('pageinit', function(){
    console.log("triggered flange load");
	flangeBox.startLoad();
});

			



	

