var wageCalcBox = {};

// Format function from stack overflow example
// First, checks if it isn't implemented yet.
if (!String.prototype.format)
{
    String.prototype.format = function() {

        var args = arguments;
        var sprintfRegex = /\{(\d+)\}/g;

        var sprintf = function (match, number) {
            return number in args ? args[number] : match;
        };

        return this.replace(sprintfRegex, sprintf);
    };
}

//setup and populate
(function(ctx) {
    ctx.setupAndStart = function() {
        //Constants
        ctx.FIVE_WEEKDAY = 0;  //five eights
        ctx.FIVE_WEEKEND = 1;  //shared
        ctx.FOUR_WEEKDAY = 2;  //four tens
        ctx.FOUR_FRIDAY = 3;  //four tens

        ctx.aboutBlurb = "Boilermaker JBox is for info only.\nIf buggy, reset your browser cache.\nComments or Questions: bmtoolbox@gmail.com\n\nLast Updated: December 12, 2014";

        ctx.wageOptions = [
            ["Helper", 32.24],
            ["1st Year", 25.25], 
            ["2nd Year", 32.24],
            ["3rd Year", 39.24],
            ["Journeyman (S)", 43.15],
            ["Journeyman (N)", 43.90],
            ["Lead Hand", 47.05],
            ["Foreman", 49.40],
            ["GF", 51.40],
            ["Custom", 40]
        ];

        ctx.dayOptions = [
            ["0", 0],
            ["8", 8],
            ["10", 10],
            ["12", 12],
            ["13", 13],
            ["A", -1],
            ["B", -2],
            ["C", -3]];
                    
        ctx.TAX_YEARS = [2014, 2015];

        //2014 tax year-------------------------------
        ctx.fedTaxTable2014 = [
            [0, 43953, 87907, 136370],  //brackets
            [0.15, 0.22, 0.26, 0.29],  //rates
            [0, 3077, 6593, 10681],  //fed constant (k from table)
            [2340.63, 2425.50, 913.68, 11138, 1127]   //Fed tax credits [sum * 0.15, cpp max, ei max, TD1 default, employment credit]
        ];
        ctx.abTaxTable2014 = [
            [], //brackets
            [.10],  //rate
            [2112.62, 2425.5, 913.68, 17787]  //AB tax credits [sum * %10, cpp max, ei max, AB1 amount]
        ];
        ctx.cppEiDuesRates = [
            0.0495,  //cpp
            0.0188,  //ei
            0.0375  //dues
        ];
        //--------------------------------------------
                
        //2015 tax year-------------------------------
        ctx.fedTaxTable2015 = [
            [0, 44701, 89401, 138586],  //brackets
            [0.15, 0.22, 0.26, 0.29],  //rates
            [0,3129,6705,10863],  //fed constant (k from table)
            [2382.53]   //Fed tax credits [sum * 0.15, cpp max, ei max, TD1 default, employment credit]
        ];
        ctx.abTaxTable2015 = [
            [], //brackets
            [.10],  //rate
            [2162.46]  //AB tax credits [sum * %10, cpp max, ei max, AB1 amount]
        ];
        //--------------------------------------------

        //Selects
        ctx.wageSel = $("#wage-select");
        ctx.sunSel = $("#sun-hours-select");
        ctx.monSel = $("#mon-hours-select");
        ctx.tueSel = $("#tue-hours-select");
        ctx.wedSel = $("#wed-hours-select");
        ctx.thuSel = $("#thu-hours-select");
        ctx.friSel = $("#fri-hours-select");
        ctx.satSel = $("#sat-hours-select");
        ctx.mealSel = $("#meal-select");
        ctx.loaSel = $("#loa-select");
        ctx.taxYearSel = $("#tax-select");
        ctx.weekArr = [ctx.sunSel, ctx.monSel, ctx.tueSel, 
            ctx.wedSel, ctx.thuSel, ctx.friSel, ctx.satSel];
        ctx.daySelClass = $(".day-select");
                

        //Dialogues [link to item, default text or preamble]
        ctx.hoursSumDia = [$("#hours-sum"), "  Hours:  1x: {0},  1.5x: {1},  2x: {2}"];
        ctx.grossSumDia = [$("#gross-sum-dialogue"), "    Taxable Gross:  ${0}"];
        ctx.exemptSumDia = [$("#exempt-sum-dialogue"), "    Tax Exempt:  ${0}"];
        ctx.deductionsSumDia = [$("#deductions-dialogue"), "    Total Deductions:  ${0}"];
        ctx.netSumDia = [$("#takehome-dialogue"), "    Take Home:  ${0}"];

        //CheckBoxes
        ctx.fourtensCheck = $("#checkbox-fourtens");
        ctx.nightsCheck = [$("#checkbox-night"), "Nights = ${0}"];
        ctx.taxCheck = [$("#checkbox-tax"), "Income Tax = ${0}"];
        ctx.eiCheck = [$("#checkbox-ei"), "EI/CPP = ${0}"];
        ctx.duesCheck = [$("#checkbox-dues"), "Working Dues = ${0}"];
        ctx.toggleClass = $(".toggle-check");
        ctx.startChecked = $(".start-checked");

        ctx.presetButtons = [
            $("#preset-clear"),
            $("#preset-tens"),
            $("#preset-twelves")
        ];
		
        ctx.saveButton = $("#apply-button");
                
                

        //[value, checkbox, string proto, custom textbox, taxable checkbox]
        ctx.weekTravel = [220, $("#checkbox-travel-week"), "Weekly Travel = ${0}", $("#textbox-weekly-travel"), $("#taxable-weekly-travel")];
        ctx.dayTravel = [20, $("#checkbox-travel-day"), "Daily Travel = ${0}", $("#textbox-daily-travel"), $("#taxable-daily-travel")];
        ctx.loa = [195, "LOA = ${0}", $("#textbox-loa")];
        ctx.meal = [40, "Meal = ${0}", $("#textbox-meal")]; 
        ctx.monthlyDues = [37.90, $("#checkbox-monthly-dues"), "Monthly Dues = ${0}", $("#textbox-monthly-dues"), 0]; 

        ctx.addTax = [0, $("#textbox-addtax")];
        ctx.customWage = [40, $("#textbox-wage"), "Custom: ${0}"];
		
        ctx.customDays = [ //textbox, Error label, Default value
            [$("#textbox-a-sing"), "Day A Single", 8.5],
            [$("#textbox-a-half"), "Day A OT",2], 
            [$("#textbox-a-double"), "Day A Double",1.5],
            [$("#textbox-b-sing"), "Day B Single", 5], 
            [$("#textbox-b-half"), "Day B OT", 0], 
            [$("#textbox-b-double"), "Day B Double", 0],
            [$("#textbox-c-sing"), "Day C Single", 1], 
            [$("#textbox-c-half"), "Day C OT", 2], 
            [$("#textbox-c-double"), "Day C Double", 3]
        ];
		
        ctx.rateInputs = [  //used to verify
            [ctx.customWage[1], "Custom Wage", 40],
            [ctx.addTax[1], "Add Tax", 0],
            [ctx.loa[2], "LOA", 195],
            [ctx.meal[2], "Meal Bonus", 40],
            [ctx.weekTravel[3], "Weekly Travel", 220],
            [ctx.dayTravel[3], "Daily Travel", 20],
            [ctx.monthlyDues[3], "Monthly Dues", 37.90]
        ];

        ctx.populateSelects();
        ctx.setClickListeners();
        ctx.setDefaultValues();
        ctx.runPreset(0);
    };

    ctx.populateSelects = function() {				
        for (var i = 0; i < ctx.wageOptions.length; i++)
        {
            var wageString = ctx.wageOptions[i][0] + ":  $" + ctx.wageOptions[i][1].toFixed(2).toString();
            ctx.wageSel.append($('<option>').text(wageString).attr('value', ctx.wageOptions[i][1]));
            if (i == 5) ctx.defaultWageVal = ctx.wageOptions[i][1];
            //console.log("Added: " + ctx.wageOptions[i][0]);
        };

        $.each(ctx.weekArr, function(j, value) {
            for (var i = 0; i < ctx.dayOptions.length; i++) {
                value.append($('<option>').text(ctx.dayOptions[i][0]).attr('value', ctx.dayOptions[i][1]));
                //console.log("Added: " + ctx.dayOptions[i][0]);
            };	
        });
		
        for(var i=0; i < 8; i++) {
            ctx.mealSel.append($('<option>').text(i).attr('value', i)); 
            ctx.loaSel.append($('<option>').text(i).attr('value', i));
        }
    };

    //binds click listener to select and toggle classes to run updateCalc
    ctx.setClickListeners = function() {
        ctx.toggleClass.bind('click', function() {
            ctx.updateCalc();	
        });

        $(document.body).on("change", "select", function() {
            ctx.updateCalc();
        });

        $.each(ctx.presetButtons, function(i, e) {
            e.bind('click', function() {
                ctx.runPreset(i);
                ctx.updateCalc();
            });
        });
		
        ctx.saveButton.bind('click', function(){
            ctx.commitSettings();
        });

        $("#about-but-wage").bind('click', function(){
            alert(ctx.aboutBlurb);
        });
        /*
		$(document.body).bind('pageinit', function() {
	        wageCalcBox.setDefaultValues();
        });
		
		$(document).on('pagechange', '#wage-page', function (event) {
            wageCalcBox.setDefaultValues();
		});
         */
		             
    };

    //called after 'pageinit' has been recieved via bind
    ctx.setDefaultValues = function() {
        ctx.wageSel.val(ctx.defaultWageVal).selectmenu('refresh');

        //I hate your face jQuery
        ctx.taxCheck[0].prop("checked", true).checkboxradio('refresh');
        ctx.eiCheck[0].prop("checked", true).checkboxradio('refresh');
        ctx.duesCheck[0].prop("checked", true).checkboxradio('refresh');

        ctx.updateCalc();
    };

    //--------------------Update-------------------------

    ctx.updateCalc = function() {
        //console.log(ctx.wageSel.val());
        //console.log($("#night-toggle").is(":checked"));

        ctx.calcPay();
        ctx.updateText();	
    };

    ctx.calcPay = function() {
        ctx.hrsWorked = 0;
        ctx.hrsArr = [0,0,0];
        ctx.deductions = [0,0,0,0,0,0,0];  //sum, fedtax, provtax, cpp, ei, working dues, monthly dues 
        ctx.taxExempt = 0; //sum
        ctx.nightPrem = 0;
        ctx.isFourTens = ctx.fourtensCheck.prop('checked');
        ctx.travelDayCount = 0;
        ctx.grossPay = 0;

        var lastHrsWorked = 0;
        for (var i = 0; i < ctx.weekArr.length; i++)
        {
            var dayArr = [0,0,0];
            var parsed = parseFloat(ctx.weekArr[i].val());
            if (parsed < 0)
            {  //custom days A=-1, B=-2, C=-3 what an abortion.
                var customIndex = (parsed === -1) ? 0 : (parsed === -2) ? 3 : 6;
                dayArr[0] = ctx.customDays[customIndex][2];  //Single
                dayArr[1] = ctx.customDays[customIndex + 1][2];  //OT
                dayArr[2] = ctx.customDays[customIndex + 2][2];  //Double
            }
            else
            {  //Use default 8/2/2 or 4 10s
                if (i === 0 || i === 6)
                {  //Sun || Sat
                    dayArr = ctx.hrsSum(ctx.FIVE_WEEKEND, parsed);
                }
                else
                {
                    if (!ctx.isFourTens)
                    {  //FiveEights weekday
                        dayArr = ctx.hrsSum(ctx.FIVE_WEEKDAY, parsed);
                    }
                    else
                    {
                        if (i === 5)
                        {  //FourTens Friday
                            dayArr = ctx.hrsSum(ctx.FOUR_FRIDAY, parsed);
                        }
                        else
                        {  //FourTens weekday
                            dayArr = ctx.hrsSum(ctx.FOUR_WEEKDAY, parsed);
                        }
                    }
                }
            }
            ctx.hrsArr[0] += dayArr[0];
            ctx.hrsArr[1] += dayArr[1];
            ctx.hrsArr[2] += dayArr[2];
            ctx.hrsWorked += dayArr[0] + dayArr[1] + dayArr[2];  //for nightshift

            if (ctx.hrsWorked - lastHrsWorked > 0)
            {
                ctx.travelDayCount++;
            }
            lastHrsWorked = ctx.hrsWorked;
        } //weekdays forloop

        ctx.bonuses = [  //value, active, taxable
            [ctx.weekTravel[0], ctx.weekTravel[1].prop('checked'), ctx.weekTravel[4].prop('checked')],  //[value, active, taxable]
            [ctx.dayTravel[0] * ctx.travelDayCount, ctx.dayTravel[1].prop('checked'), ctx.dayTravel[4].prop('checked')],
            [ctx.loa[0] * ctx.loaSel.val(), true, false], //LOA
            [ctx.meal[0] * ctx.mealSel.val(), true, false]  //Meal bonuses
        ];

        ctx.wageVal = parseFloat(ctx.wageSel.val());

        ctx.grossPay = ctx.hrsArr[2] * ctx.wageVal * 2 +
                ctx.hrsArr[1] * ctx.wageVal * 1.5 +
                ctx.hrsArr[0] * ctx.wageVal;
        if (ctx.nightsCheck[0].prop("checked"))
        {  //Nightshift premium $3/hr
            ctx.nightPrem = 3 * ctx.hrsWorked;
        }
        ctx.grossPay += ctx.nightPrem;
        ctx.grossNoVac = ctx.grossPay;
        ctx.grossPay *= (1 + 0.1);  //vacation pay @ %10 

        $.each(ctx.bonuses, function(i, e) {
            if (e[1]) { //active toggle
                if (e[2]) {  //taxable
                    ctx.grossPay += e[0];
                } else {
                    ctx.taxExempt += e[0];
                }
            }
            //console.log("taxable i = " + i + ". e[2] = " + e[2]);
        });
                
        ctx.taxYear = ctx.TAX_YEARS[ctx.taxYearSel.prop("selectedIndex")];
                
        ctx.deductions[1] = ctx.taxFed(ctx.grossPay, ctx.taxYear);
        ctx.deductions[1] += ctx.addTax[0];
        ctx.deductions[2] = ctx.taxAB(ctx.grossPay, ctx.taxYear);  //Todo: province select
        var cppEiDuesArr = ctx.cppEiDues(ctx.grossPay, ctx.grossNoVac);

        ctx.deductions[3] = cppEiDuesArr[0];
        ctx.deductions[4] = cppEiDuesArr[1];
        ctx.deductions[5] = cppEiDuesArr[2];
        ctx.deductions[6] = ctx.monthlyDues[0];

        ctx.deductions[1] = (ctx.taxCheck[0].prop('checked')) ? ctx.deductions[1] : 0;
        ctx.deductions[2] = (ctx.taxCheck[0].prop('checked')) ? ctx.deductions[2] : 0;
        ctx.deductions[3] = (ctx.eiCheck[0].prop('checked')) ? ctx.deductions[3] : 0;
        ctx.deductions[4] = (ctx.eiCheck[0].prop('checked')) ? ctx.deductions[4] : 0;
        ctx.deductions[5] = (ctx.duesCheck[0].prop('checked')) ? ctx.deductions[5] : 0;
        ctx.deductions[6] = (ctx.monthlyDues[1].prop('checked')) ? ctx.deductions[6] : 0;


        for (var i = 1; i < ctx.deductions.length ; i++)
        {  //get sum of deductions non zeroed
            ctx.deductions[0] += ctx.deductions[i];
        }
        ctx.takeHome = ctx.grossPay - ctx.deductions[0] + ctx.taxExempt;
    };
	
    ctx.commitSettings = function() {	
        //don't change values if verify returns false
        if(!ctx.verifyTextboxValues()){
            console.log("Setting parse Fail.");
            return;
        }
        ctx.customWage[0] = parseFloat(ctx.customWage[1].val());
        //custom wage select option val
        $("#wage-select option:contains('Custom')").val(ctx.customWage[0]);
        //console.log("Change custom wage val to " + ctx.customWage[0]);
        ctx.addTax[0] = parseFloat(ctx.addTax[1].val());
        ctx.loa[0] = parseFloat(ctx.loa[2].val());
        ctx.meal[0] = parseFloat(ctx.meal[2].val());
        ctx.weekTravel[0] = parseFloat(ctx.weekTravel[3].val());
        ctx.dayTravel[0] = parseFloat(ctx.dayTravel[3].val());
        ctx.monthlyDues[0] = parseFloat(ctx.monthlyDues[3].val());
                
        for(var i=0; i < ctx.customDays.length; i++)
            ctx.customDays[i][2] = parseFloat(ctx.customDays[i][0].val());
        ctx.updateCalc();
    };

    ctx.hrsSum = function(dayType, hrs) {  //Splits for default contract days
        var retArr = [0,0,0];

        var remTwelve = (hrs - 10 > 0) ? hrs - 10 : 0;
        var remTen = (hrs - 8 - remTwelve > 0) ? hrs - 8 - remTwelve : 0;
        var remEight = hrs - remTwelve - remTen;

        switch (dayType)
        {
            case ctx.FIVE_WEEKDAY:
                retArr[2] = remTwelve;
                retArr[1] = remTen;
                retArr[0] = remEight;
                break;
            case ctx.FIVE_WEEKEND:
                retArr[2] = hrs;
                break;
            case ctx.FOUR_WEEKDAY:
                retArr[0] = remTen + remEight;
                retArr[2] = remTwelve;
                break;
            case ctx.FOUR_FRIDAY:
                retArr[1] = remTen + remEight;
                retArr[2] = remTwelve;
                break;
            default:  //incase of fail call
                return [0,0,0];
        }
        return retArr;
    };

    //Canadian Federal Tax
    ctx.taxFed = function(gross, taxYear) {
        var anGross = gross * 52;
        var fedTax = 0;
        var bracket = ctx.fedTaxTable2014[0];
        var rate = ctx.fedTaxTable2014[1];
        var fedConst = ctx.fedTaxTable2014[2];
        var fedTaxCred = ctx.fedTaxTable2014[3][0];
                
        if(taxYear === 2015) {
            bracket = ctx.fedTaxTable2015[0];
            rate = ctx.fedTaxTable2015[1];
            fedConst = ctx.fedTaxTable2015[2];
            fedTaxCred = ctx.fedTaxTable2015[3][0];
        }
                
        if (anGross < bracket[1])
        {
            fedTax = anGross * rate[0] - fedConst[0] - fedTaxCred;
        }
        else
        {
            if (anGross < bracket[2])
            {
                fedTax = anGross * rate[1] - fedConst[1] - fedTaxCred;
            }
            else
            {
                if (anGross < bracket[3])
                {
                    fedTax = anGross * rate[2] - fedConst[2] - fedTaxCred;	
                }
                else
                {
                    //if(anGross >= bracket[3])
                    fedTax = anGross * rate[3] - fedConst[3] - fedTaxCred;			
                }
            }
        }
        return (fedTax > 0) ? fedTax / 52 : 0;
    };

    //Alberta Provincial tax
    ctx.taxAB = function(gross, taxYear) {
        var abRate = ctx.abTaxTable2014[1][0];
        var abTaxCred = ctx.abTaxTable2014[2][0];
            
        if(taxYear === 2015){
            abRate = ctx.abTaxTable2015[1][0];
            abTaxCred = ctx.abTaxTable2015[2][0];
        }
            
        var abTax = (gross * 52 * abRate - abTaxCred) / 52;  //wow, such simple
        return (abTax > 0) ? abTax : 0;
    };

    ctx.cppEiDues = function(gross, grossNoVac) {
        var retArr = [0,0,0];
        var rates = ctx.cppEiDuesRates;
        var anGross = gross * 52;
        retArr[0] = (anGross - 3500) / 52 * rates[0];
        retArr[1] = gross * rates[1];
        retArr[2] = grossNoVac * rates[2];  //dues
        retArr[0] = (retArr[0] > 0) ? retArr[0] : 0; //zeros negative vals for cpp
        return retArr;
    };

    ctx.updateText = function() {
        //[$("#hours-sum"), "  Hours:  1x: 0  1.5x: 0  2x: 0"];
        ctx.hoursSumDia[0].text(ctx.hoursSumDia[1].format(ctx.hrsArr[0], ctx.hrsArr[1], ctx.hrsArr[2]));
        ctx.grossSumDia[0].text(ctx.grossSumDia[1].format(ctx.grossPay.toFixed(2)));
        ctx.exemptSumDia[0].text(ctx.exemptSumDia[1].format(ctx.taxExempt.toFixed(2)));
        ctx.deductionsSumDia[0].text(ctx.deductionsSumDia[1].format(ctx.deductions[0].toFixed(2)));
        ctx.netSumDia[0].text(ctx.netSumDia[1].format(ctx.takeHome.toFixed(2)));

        $("label[for='checkbox-night']").text(ctx.nightsCheck[1].format(ctx.nightPrem));
            
        $("label[for='checkbox-tax']").text(ctx.taxCheck[1].format((ctx.deductions[1] + ctx.deductions[2]).toFixed(2)));
        $("label[for='checkbox-ei']").text(ctx.eiCheck[1].format((ctx.deductions[3] + ctx.deductions[4]).toFixed(2)));
        $("label[for='checkbox-dues']").text(ctx.duesCheck[1].format(ctx.deductions[5].toFixed(2)));
        $("label[for='checkbox-monthly-dues']").text(ctx.monthlyDues[2].format(ctx.deductions[6].toFixed(2)));
        $("label[for='checkbox-travel-week']").text(ctx.weekTravel[2].format(ctx.weekTravel[0].toFixed(2)));
        $("label[for='checkbox-travel-day']").text(ctx.dayTravel[2].format((ctx.dayTravel[0] * ctx.travelDayCount).toFixed(2)));		
		
        //update custom select
        $("#wage-select option:contains('Custom')").text(ctx.customWage[2].format(ctx.customWage[0]));
        $("#wage-select").selectmenu("refresh", true);
    };

    ctx.runPreset = function(preset) {
        var selectVal = 0;
        var mealVal = 0;
        switch (preset)
        {
            case 0:  //clear
                selectVal = 0;
                break;
            case 1:  //10s
                selectVal = 10;
                break;
            case 2:  //12s
                selectVal = 12;
                mealVal = 7;
                break;
        }
        $.each(ctx.weekArr, function(i, e) {
            e.val(selectVal).selectmenu('refresh');
        });
        ctx.loaSel.val(0).selectmenu('refresh');
        ctx.mealSel.val(mealVal).selectmenu('refresh');
    };

    //Modes for verifyInput [mode, lower limit, upper limit]
    ctx.VER_HOURS = [0, 24];  //expecting [float, float, float]
    ctx.RANGE_RATE = [0, 1000000];  //expecting float
    ctx.numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;

    ctx.verifyTextboxValues = function() {
        //Get string with errors
        var returnedErrors = ctx.verifyValues(ctx.rateInputs, ctx.RANGE_RATE);
        var combinedErrors = returnedErrors.concat(ctx.verifyValues(ctx.customDays, ctx.VER_HOURS));

        //Alert string
        var alertString = "";
        if(combinedErrors.length > 0) {
            for(var i = 0; i < combinedErrors.length; i++) {
                alertString += combinedErrors[i];
                if(i !== combinedErrors.length - 1) {
                    alertString = alertString + "\n";
                }
            }
            console.log(alertString);
            alert(alertString);
            return false;
        }
        //change colour of fucked up ones?
        return true;
    };
	
    ctx.verifyValues = function(values, range) {
        var returnErrors = [];
        $.each(values, function(i, e) {
            if (!ctx.numberRegex.test(e[0].val())) {
                //alert('Not a Number');
                returnErrors.push(e[1] + " is invalid");			   
            } else {
                if (e[0].val() < range[0]) {
                    //alert('Too Low');
                    returnErrors.push(e[1] + " is too low");
                } else {
                    if (e[0].val() > range[1]) {
                        //alert('Too High');
                        returnErrors.push(e[1] + " is too high");
                    }
                }
            }
        });
        return returnErrors;
    };

})(wageCalcBox);

$("#wage-page").on('pagecreate',  function(){
    console.log("ran page init");
    wageCalcBox.setupAndStart();
});
