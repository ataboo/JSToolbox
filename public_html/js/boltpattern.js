boltPatternBox = {};

//move to plugins later
if (typeof String.prototype.startsWith !== 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}
if(typeof String.prototype.repeat !== 'function') {
	String.prototype.repeat = function (num)
	{
    	return new Array( num + 1 ).join( this );
	};
}

(function(ctx) {
	ctx.setupAndStart = function() {
		ctx.studCount = 24;
		ctx.patternType = 0;
		ctx.goButton = $("#boltpat-go");
		ctx.patternSel = $("#boltpat-select");
		ctx.patternVis = $("#boltpat-vis");
		ctx.sequenceOut = $("#boltpat-out");
		ctx.studCountInput = $("#boltpat-stud-count");
		
		ctx.visuals = [  //s==&nbsp, l==<br>
		    ["s10", "1", "l2", 
			"4", "s17", "3", "l2", 
			"s10", "2"],
			
			["s10", "1", "l1", 
			"s4", "8", "s9", "5", "l1", 
			"4", "s17", "3", "l1",
			"s4", "6", "s9", "7", "l1",
			"s10", "2"]
		];
		
		ctx.PATTERN_FOUR = 0;
		ctx.PATTERN_EIGHT = 1;
		
		ctx.setBinds();
		//ctx.updatePatVis();
	};
	
	ctx.setBinds = function() {
		ctx.patternSel.bind('change', function(){
			//console.log("select changed");
			ctx.updatePatVis();
		});
		
		ctx.goButton.bind('click', function(){
			//console.log("pushed bootan");
			ctx.calcPattern();
		});
	};
	
	ctx.updatePatVis = function() {
		ctx.patternType = ctx.patternSel[0].selectedIndex;
		var patStr = ctx.visuals[ctx.patternType];
		ctx.patternVis.html(ctx.genHtmlVis(patStr));
	};
	
	ctx.calcPattern = function() {
		if(!ctx.studCountValid()) return;
		ctx.studCount = parseInt(ctx.studCountInput.val());
		var sequence = "";
		sequence = ctx.genSequence(ctx.studCount, ctx.patternType);
		ctx.sequenceOut.html(sequence);
	};
	
	ctx.studCountValid = function() {
		//TODO
		var inputParsed = parseInt(ctx.studCountInput.val());
		if(isNaN(inputParsed)){ 
			alert("Stud Count is invalid.");
			return false;
		}
		if(inputParsed > 1000 || inputParsed < 8) {
			alert("Stud Count must be between 8 and 1000.");
			return false;
		}
		if(inputParsed % 2 > 0){
			alert("Stud Count must be even.");
			return false;
		}
		return true;
	};
	
	ctx.genSequence = function(studCount, type){
		//switch-case if needed later
		var seqOut = "Pattern: &nbsp";
		var factor = 0;
		var basePat = [];
		
		if(type === ctx.PATTERN_FOUR){
			factor = 4;
			basePat = [1,3,2,4];
		} else{
			factor = 8;
			basePat = [1,5,3,7,2,6,4,8];
		}
		
		var boldFlag = false;
		
		for(var i=0; i < basePat.length; i++){
			for(var j=basePat[i]; j < studCount + 1; j+=factor){
				if(j !== 1){
					seqOut += ", ";
					if(j === basePat[i]) {
						seqOut += "&nbsp&nbsp<b>";
						boldFlag = true;
					}
				} else{  //1 still needs bold but no spaces
					seqOut += "<b>";
					boldFlag = true;
					
				}
				seqOut += j;
				if(boldFlag){
					seqOut += "</b>";
				}
			}
		}		
		return seqOut;
	};
	
	ctx.genHtmlVis = function(patArr){
		var outStr = "";
		for(var i=0; i < patArr.length; i++) {
			var string = patArr[i];
			var charCount = 0;
			if(patArr[i].startsWith('s')) {
				charCount = parseInt(string.replace('s', ''));
					outStr = outStr + "&nbsp".repeat(charCount); 			
			} else {
				if(patArr[i].startsWith('l')){
					charCount = parseInt(string.replace('l', ''));
					outStr = outStr + "<br>".repeat(charCount);
				} else {
					outStr = outStr + patArr[i];
				}
			}
		}
		return outStr;
	};
	
}) (boltPatternBox);

$("#bolt-page").on('pagecreate', "#bolt-page", function(){
    boltPatternBox.setupAndStart();
	console.log("ran page init bolt page");
});
