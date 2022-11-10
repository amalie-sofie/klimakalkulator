			$(document).ready(function () {
				var boligCalc, transportCalc, matCalc, elartikkelCalc, streamingCalc, forbrukCalc = false;
				var initFormCalc = false;

				// BOLIG
				var boligparametereCO2 = ({stromkwh:2, fyringsoljekwh: 0.475, fjernvarmekwh: 0.245, vedfyringkwh: 0.261 ,leilighetm2: 218, boligm2: 229, utslippsfaktorstrom: 0.211, boligoppv: 133, boligannet: 88});
				var boligkalkulasjon = ({typebolig: '', storrelse: 0, oppvarmingskilde: '', vedforbruk: 0.1, stromforbruk:0, antvoksne: 1, antbarn:0, husstandfaktor: 1});
				var vedChecked = false;

				var stromChecked = false;
				var fjernvarmeChecked = false;
				var fyringsoljeChecked = false;

				// TRANSPORT
				var flyparametereCO2 = ({skandinaviareise:350, europareise: 1500, interkontinentalreise:7000, skandinaviautslipp: 0.214 ,europautslipp: 0.1824, interkontinentalutslipp: 0.1536});
				var flykalkulasjon = ({skandinavia: 0, europa: 0, interkontinental: 0});
				var kategoriResultat = ({bolig: 0, transport: 0, mat: 0, forbruk: 0, total: 0});
				//var bilparameterCO2 = ({bensin: 2.8342, diesel: 3.0996, hybrid: 1, el: 0.04,  passasjerbelegg: 1.73});
				var bilparameterCO2 = ({bensin: 2.9, diesel: 2.9, hybrid: 0.160, el: 0.04,  passasjerbelegg: 1.73});

				var transportparameterCO2 = [];
				transportparameterCO2["buss"] = ({kort: 8, kort_km_time: 22, lang: 500, lang_km_time: 70,  utslippkort: 0.103, utslipplang: 0.052});
				transportparameterCO2["tog"] = ({kort: 8, kort_km_time: 22, lang: 500, lang_km_time: 70,  utslippkort: 0.041, utslipplang: 0.043});
				transportparameterCO2["ferje"] = ({kort: 25, kort_km_time: 27, lang: 25, lang_km_time: 50,  utslippkort: 0.041, utslipplang: 0.043});
				var transportkalkulasjon = [];

				// MAT
				var matparametereCO2 = ({kjottmiddag:3.68, fiskemiddag: 2.11, vegetarmiddag:1.79, kgkjottmiddag:0.856});
				var matkalkulasjon = ({kjottmiddag: 0, fiskemiddag: 0, vegetarmiddag: 0, annet:0.67});

				// ELARTIKKEL
				var elartikkelparameterCO2 = ({telefonkjop:10, datamaskinkjop: 10, tvkjop:10, kgtelefon:1.5});
				var elartikkelkalkulasjon = ({telefonkjop: 0, datamaskinkjop: 0, tvkjop: 0, annet:0.1});

				// STREAMING
				var streamingparameterCO2 = ({streamingantall:10, kgstreaming:1.5});
				var streamingkalkulasjon = ({streamingantall: 0, annet:0.1});

				// FORBRUK
				var forbrukparametereCO2 = ({utslippsfaktorforbruk_krone:0.04 , gjennomsnittfaktor: 0.4, forbrukmaned: 13504, undersnitt: 0.75, snitt: 1, oversnitt: 1.25});
				var forbrukerkalkulasjon = ({nettoinntekt: 25000, utgifter: 0, utslipptotal: 0, forbrukertype: 0});

				jQuery.fn.ForceNumericOnly =
				function() {
	    		return this.each(function() {
	        	$(this).keydown(function(e) {
	        		var ctrlDown = e.ctrlKey||e.metaKey;
	            var key = e.charCode || e.keyCode || 0;
	            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
	            if (key == 188) {this.value += '.'};
	            return (
	            	ctrlDown ||
	                key == 8 ||
	                key == 9 ||
	                key == 46 ||
	                key == 109 ||
	                //key == 188 ||
	                key == 189 ||
	                key == 190 ||
	                (key == 17 && key == 67) ||
	                (key == 17 && key == 86) ||
	                (key >= 37 && key <= 40) ||
	                (key >= 48 && key <= 57) ||
	                (key >= 96 && key <= 105));
	        	});
	    		});
				};

				$('#klimakalkulatorwrapper input[type="text"]').ForceNumericOnly();

				function postToFeed() {
					var link = 'http://nrk.no/viten/ta-klimatesten-her-1.11519317';
					var picture = '';
					var picture1 = 'https://www.nrk.no/contentfile/web/files/nrk.no/viten/klimakalkulator/grafikk/klimaengelfb.png';
					var picture2 = 'https://www.nrk.no/contentfile/web/files/nrk.no/viten/klimakalkulator/grafikk/miljosvinfb.png';
					var picture3 = 'https://www.nrk.no/contentfile/web/files/nrk.no/viten/klimakalkulator/grafikk/noytralfb.png';
					var appID = '458132217643197';
					var post_tekst = '';
					if( kategoriResultat.total < 10) {
						picture = picture1;
						post_tekst = 'Mitt totale CO2-avtrykk er ' + kategoriResultat.total + ' tonn CO2. Jeg er en miljøengel, i alle fall sammenlignet med andre nordmenn. Men det er ingen grunn til å slappe av likevel!';
					}
					else if (kategoriResultat.total >= 10 && kategoriResultat.total < 12) {
						picture = picture3;
						post_tekst = 'Mitt totale CO2-avtrykk er ' + kategoriResultat.total + ' tonn CO2. Jeg er verken et klimasvin eller en miljøengel, men en helt gjennomsnittlig miljønordmann. Kanskje på tide å begynne å gå til jobben?';
					}
					else if (kategoriResultat.total >= 12) {
						picture = picture2;
						post_tekst = 'Mitt totale CO2-avtrykk er ' + kategoriResultat.total + ' tonn CO2. Jeg er et klimasvin. Nå er det på tide å skjerpe seg!';
					}
					var redirect = 'https://www.nrk.no/contentfile/web/files/nrk.no/viten/klimakalkulator/selfclose.html';
					var posturl = 'https://www.facebook.com/dialog/feed?_path=feed&app_id=' + appID + '&client_id=' + appID + '&redirect_uri=' + redirect + '&sdk=joey&display=popup&link=' + link + '&picture=' + picture + '&name=Test ditt klimautslipp&caption=' + post_tekst + '&description=Klimakalkulator&e2e=%7B%7D&locale=nb_NO&from_login=1';
					window.open(posturl,'sharer', config='height=200,width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, directories=no, status=no');
				}
				function setTekst() {
					var post_tekst = '';
					if( kategoriResultat.total < 10) {
						post_tekst = 'Mitt totale CO2-avtrykk er <b>' + kategoriResultat.total + ' tonn CO2.</b> Jeg er en miljøengel, i alle fall sammenlignet med andre nordmenn. Men det er ingen grunn til å slappe av likevel!';
					}
					else if (kategoriResultat.total >= 10 && kategoriResultat.total < 12) {
						post_tekst = 'Mitt totale CO2-avtrykk er <b>' + kategoriResultat.total + ' tonn CO2.</b> Jeg er verken et klimasvin eller en miljøengel, men en helt gjennomsnittlig miljønordmann. Kanskje på tide å begynne å gå til jobben?';
					}
					else if (kategoriResultat.total >= 12) {
						post_tekst = 'Mitt totale CO2-avtrykk er <b>' + kategoriResultat.total + ' tonn CO2.</b> Jeg er et klimasvin. Nå er det på tide å skjerpe seg!';
	    		}
					$("#klimakalkulatorwrapper #svarskjema #facebookcontainer #facebooktext").html(post_tekst);
				}
				function initForm() {
					$("#klimakalkulatorwrapper #Faktaboks").append("<div id='svarskjema'></div>");
					$("#klimakalkulatorwrapper #svarskjema").append("<div id='facebookcontainer'><div id='facebooktext'></div><div id='facebookpost'><img src='http://b.static.ak.fbcdn.net/rsrc.php/z39E0/hash/ya8q506x.gif'></img><div id='lenketekst'>Post til facebook</div></div></div>");
				}
				//initForm();
				$(document).on('click',"#klimakalkulatorwrapper #facebookpost",function(e){
					postToFeed();
				});
				Highcharts.theme = {
   				/* LINE/BAR/COLUMN/SLICE COLORS - only used for slices for Plex, if we add multiple data sets in future releases, these colors will work with the rendering of other sets */
   				colors: ['#33FFFF', '#66FFFF', '#99FFFF', '#CCFFFF'],
   				/* CHART TITLE */
   				title: {
    				style: {
							color: '#000',
							font: 'bold 16px "Lucida Grande", Helvetica, Arial, sans-serif'
						}
					},
					/* CHART SUBTITLE */
					subtitle: {
    				style: {
      				color: '#666666',
      				font: 'bold 12px "Lucida Grande", Helvetica, Arial, sans-serif'
						}
					},
					/* CHART X-AXIS */
   				xAxis: {
    				lineColor: '#000',
      			tickColor: '#000',
      			labels: {
      				style: {
        				color: '#000',
          			font: '11px "Lucida Grande", Helvetica, Arial, sans-serif'
							}
						},
      			title: {
      				style: {
        				color: '#333',
        				font: 'bold 12px "Lucida Grande", Helvetica, Arial, sans-serif'
							}
						}
					},
					/* CHART Y-AXIS */
					yAxis: {
      			minorTickInterval: 'false', /* OPTIONAL PARAMETER - SHOWS HORIZONTAL LINES in between tick values */
      			lineColor: '#000',
      			lineWidth: 1,
      			tickWidth: 1,
      			tickColor: '#000',
      			labels: {
      				style: {
        				color: '#000',
          			font: '11px "Lucida Grande", Helvetica, Arial, sans-serif'
							}
						},
						title: {
      				style: {
        				color: '#333',
        				font: 'bold 12px "Lucida Grande", Helvetica, Arial, sans-serif'
							}
						}
					},
					/* LINE CHART COLORS */
					plotOptions: {
						line: {
      				lineWidth: 3,
        			shadow: false,
        			marker: {
        			fillColor: '#fff', /* LINE POINT COLOR */
          		lineWidth: 2,
          		radius: 4,
          		symbol: 'circle', /* "circle", "square", "diamond", "triangle" and "triangle-down" */
          		lineColor: null // inherit from above defined colors
						}
						},
      			column: {
      				cursor: 'pointer',
        			borderColor: '#333',
        			borderWidth: 1,
        			shadow: false
						},
						bar: {
							cursor: 'pointer',
        			borderColor: '#333',
        			borderWidth: 1,
        			shadow: false
						},
      			pie: {
      				cursor: 'pointer',
        			borderColor: '#666',
        			borderWidth: 2,
        			shadow: false
						}
					}
				};
				Highcharts.setOptions(Highcharts.theme);
				var myPie;
				var myGauge;
				myPie = new Highcharts.Chart({
				chart: {
					renderTo: 'piecontainer',
					type: 'gauge',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                height:260,
                width:310
							},
        title: {
        	text: 'CO2-fordeling'
        },
        credits: {
					enabled: false
				},
        tooltip: {
        	pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
        	pie: {
          	allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
            	enabled: false,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function() {
              	return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
							}
						},
            showInLegend: true
					}
				},
        series: [{
          	type: 'pie',
            name: 'Prosent',
            data: [
            	['Bolig',0],
							['Transport',0],
							['Elartikkel',0],
							['Streaming',0],
              ['Mat',0],
              ['Forbruk',0],
						]
					}]
				});
				myGauge = new Highcharts.Chart({
	    		chart: {
	    			renderTo: 'gaugecontainer',
	        	type: 'gauge',
	        	plotBackgroundColor: null,
	        	plotBackgroundImage: null,
	        	plotBorderWidth: 0,
	        	plotShadow: false,
	        	height: 180,
	        	width:220
					},
	    		title: {
	        	text: 'Total CO2'
					},
        	credits: {
						enabled: false
					},
	    		pane: {
						startAngle: -90,
						endAngle: 90,
						background: [{
							backgroundColor: {
				 				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				    		stops: [
				      	[0, '#FFF'],
				      	[1, '#333']
							]
							},
				    	borderWidth: 0,
				    	outerRadius: '108%'
							}, {
				    	backgroundColor: {
				    		linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				      	stops: [
									[0, '#333'],
									[1, '#FFF']
								]
							},
				      borderWidth: 1,
				      outerRadius: '107%'
				     	}, {
				      // default background
				      }, {
				      backgroundColor: '#DDD',
				      borderWidth: 0,
				      outerRadius: '102%',
							innerRadius: '103%'
						}],
						center: ['50%', '90%'],
						size: 190
					},
					yAxis: {
	        	min: 0,
	        	max: 24,
						minorTickInterval: 'auto',
	        	minorTickWidth: 1,
	        	minorTickLength: 10,
	        	minorTickPosition: 'inside',
	        	minorTickColor: '#666',
	        	tickPixelInterval: 24,
	        	tickWidth: 2,
	        	tickPosition: 'inside',
	        	tickLength: 10,
	        	tickColor: '#666',
	        	title: {
	          	text: 'tonn CO2'
						},
	        	plotBands: [{
	          	from: 0,
	          	to: 10,
	          	color: '#CCFFFF' // green
						}, {
							from: 10,
	            to: 12,
	            color: '#99FFFF' // yellow
	        		}, {
	            from: 12,
	            to: 24,
	            color: '#33CCCC' // red
	        	}],
						plotOptions: {
	    				gauge: {
								enableMouseTracking: false,
	   						cursor: 'pointer',
	   						showCheckbox: false,
	   						dataLabels: {
	   						enabled: false
							},
	   						dial: {
	   						radius: '90%'
							}
							}
						}
					},
	    		series: [{
	        	name: 'Utslipp: ',
	        	data: [0],
	        	tooltip: {
							valueSuffix: ' tonn CO2',
							valueDecimals: 2
	        	},
	    		}]
				});
				function showPercentage(perc1, perc2, perc3, perc4) {
					if(myPie) {
						myPie.series[0].points[0].update(perc1);
						myPie.series[0].points[1].update(perc2);
						myPie.series[0].points[2].update(perc3);
						myPie.series[0].points[3].update(perc4);
					}
				}
				function showResult(tonn) {
					if(myGauge) {
						myGauge.series[0].points[0].update(tonn);
					}
				}
				showResult();
				//showPercentage(0,0,0,0);

				// BOLIG
				$(document).on("change", "#klimakalkulatorwrapper #boligside .bolig input[type='radio']", function(e) {
					e.stopPropagation();
					boligkalkulasjon.typebolig = $(this).val();
					calculateBoligCO2();
				});
				$(document).on("change", "#klimakalkulatorwrapper #boligside .oppvarming input[type='radio']", function(e) {
					e.stopPropagation();
					boligkalkulasjon.oppvarmingskilde = $(this).val();
					calculateBoligCO2();
				});
				$(document).on("change", "#klimakalkulatorwrapper #boligside .oppvarming input[type='checkbox']", function(e) {
					e.stopPropagation();
					if ($(this).prop('checked')) {
						vedChecked = true;
					}
					else {
						vedChecked = false;
					}
					calculateBoligCO2();
				});
				$(document).on('change','#klimakalkulatorwrapper #boligside .oppvarming select',function(e){
					e.stopPropagation();
   				boligkalkulasjon.vedforbruk = Number($(this).val());
   				calculateBoligCO2();
				});
				$(document).on("keyup", "#klimakalkulatorwrapper #boligside .husstand input", function(e) {
					e.stopPropagation();
					switch ($(this).attr('id')) {
						case 'voksnehusstand': boligkalkulasjon.antvoksne = Number($(this).val());
						break;
						case 'barnhusstand': boligkalkulasjon.antbarn = Number($(this).val());
						break;
						default: return;
					}
					boligkalkulasjon.husstandfaktor = boligkalkulasjon.antvoksne + (boligkalkulasjon.antbarn/2);
					calculateBoligCO2(true);
					calculateForbrukCO2(true);
				});
				$(document).on("keyup", "#klimakalkulatorwrapper #boligside input", function(e) {
					e.stopPropagation();
					switch ($(this).attr('id')) {
						case 'storrelsem2': boligkalkulasjon.storrelse = $(this).val();
						break;
						case 'stromforbrukkwh': boligkalkulasjon.stromforbruk = $(this).val();
						break;
						default: return;
					}
					calculateBoligCO2();
				});
				$(document).on('change','#klimakalkulatorwrapper #boligside .inntektselect select',function(e){
					e.stopPropagation();
					forbrukerkalkulasjon.nettoinntekt = Number($(this).val());
					calculateForbrukCO2();
				});

				//TRANSPORT
				var transportmiddel = 1;

				$(document).on('change','#klimakalkulatorwrapper #transportside .transportmiddelselect select',function(e){
					e.stopPropagation();
					transportmiddel = Number($(this).val());
				});

				var transport_teller = 0;

				//Legge til transportmiddel
				$(document).on("mousedown", "#klimakalkulatorwrapper #transportside .transportmiddelselect input", function(e) {
					e.stopPropagation();
					var currenttransportmiddel = $('#klimakalkulatorwrapper #transportside .transportmiddelselect select').val();
					transportkalkulasjon[transport_teller] = ({transportmiddel: currenttransportmiddel, CO2:0});
					var transportmiddel = [];

					transportmiddel['bil'] = '<div id="subforminput" class="bil" pos="' + transport_teller + '"><div id="subtitle">Bil: </div><div id="desc">Kjørte km pr. år</div><input type="text" id="bilkm" name="bilkm" value=""/><div id="desc">Drivstofforbruk</div><select id="litermil"><option value="0.1">0,1 liter/mil</option><option value="0.2">0,2 liter/mil</option><option value="0.3">0,3 liter/mil</option><option value="0.4">0,4 liter/mil</option><option value="0.5">0,5 liter/mil</option><option value="0.6">0,6 liter/mil</option><option selected="selected" value="0.7">0,7 liter/mil</option><option value="0.8">0,8 liter/mil</option><option value="0.9">0,9 liter/mil</option><option value="1">1,0 liter/mil</option><option value="1.1">1,1 liter/mil</option><option value="1.2">1,2 liter/mil</option><option value="1.3">1,3 liter/mil</option><option value="1.4">1,4 liter/mil</option><option value="1.5">1,5 liter/mil</option><option value="1.6">1,6 liter/mil</option><option value="1.7">1,7 liter/mil</option><option value="1.8">1,8 liter/mil</option><option value="1.9">1,9 liter/mil</option><option value="2.0">2,0 liter/mil</option><option value="2.1">2,1 liter/mil</option><option value="2.2">2,2 liter/mil</option><option value="2.3">2,3 liter/mil</option><option value="2.4">2,4 liter/mil</option><option value="2.5">2,5 liter/mil</option><option value="2.6">2,6 liter/mil</option><option value="2.7">2,7 liter/mil</option><option value="2.8">2,8 liter/mil</option><option value="2.9">2,9 liter/mil</option><option value="3">3,0 liter/mil</option></select><select id="drivstofftype"><option value="bensin">Bensin</option><option value="diesel" selected="selected">Diesel</option><option value="hybrid">Hybrid</option><option value="el">El</option></select><div id="subforminputdelete"></div></div>';

					transportmiddel['buss'] = '<div id="subforminput" class="buss"  pos="' + transport_teller + '"><div id="subtitle">Buss: </div><ul><li><div id="desc">Antall korte turer<br/><em>(mindre enn 1 time)</em></div><input type="text" id="korteturer" name="korteturer" value=""/><select id="typeturkort"><option value="turer" selected="selected">turer</option><option value="timer">timer</option></select><select id="typetidkort"><option value="ukentlig">pr. uke</option><option value="manedlig" selected="selected">pr. md.</option></select></li><li><div id="desc">Antall lengre turer<br/><em>(mer enn 1 time)</em></div><input type="text" id="langeturer" name="langeturer" value=""/><select id="typeturlang"><option value="turer" selected="selected">turer</option><option value="timer">timer</option></select><select id="typetidlang"><option value="ukentlig">pr. uke</option><option value="manedlig" selected="selected">pr. md.</option></select><div id="subforminputdelete"></div></li></ul></div>';

					//transportmiddel['buss'] = '<div id="subforminput" class="buss"  pos="' + transport_teller + '"><div id="subtitle">Buss: </div><ul><li><div id="desc">Antall korte turer<br/><em>(mindre enn 1 time)</em></div><input type="text" id="korteturer" name="korteturer" value=""/><select id="typeturkort"><option value="turer" selected="selected">turer</option><option value="timer">timer</option></select><select id="typetidkort"><option value="ukentlig">pr. uke</option><option value="manedlig" selected="selected">pr. md.</option></select></li><li><div id="desc">Antall lengre turer<br/><em>(mer enn 1 time)</em></div><input type="text" id="langeturer" name="langeturer" value=""/><select id="typeturlang"><option value="turer" selected="selected">turer</option><option value="timer">timer</option></select><select id="typetidlang"><option value="ukentlig">pr. uke</option><option value="manedlig" selected="selected">pr. md.</option></select><div id="subforminputdelete"></div></li></ul></div>';

					transportmiddel['ferje'] = '<div id="subforminput" class="ferje"  pos="' + transport_teller + '"><div id="subtitle">Ferje: </div><ul><li><div id="desc">Antall korte turer<br/><em>(mindre enn 1 time)</em></div><input type="text" id="korteturer" name="korteturer" value=""/><select id="typeturkort"><option value="turer" selected="selected">turer</option><option value="timer">timer</option></select><select id="typetidkort"><option value="ukentlig">pr. uke</option><option value="manedlig" selected="selected">pr. md.</option></select></li><li><div id="desc">Antall lengre turer<br/><em>(mer enn 1 time)</em></div><input type="text" id="langeturer" name="langeturer" value=""/><select id="typeturlang"><option value="turer" selected="selected">turer</option><option value="timer">timer</option></select><select id="typetidlang"><option value="ukentlig">pr. uke</option><option value="manedlig" selected="selected">pr. md.</option></select><div id="subforminputdelete"></div></li></ul></div>';

					transportmiddel['tog'] = '<div id="subforminput" class="tog"  pos="' + transport_teller + '"><div id="subtitle">Tog, trikk, t-bane: </div><ul><li><div id="desc">Antall korte turer<br/><em>(mindre enn 1 time)</em></div><input type="text" id="korteturer" name="korteturer" value=""/><select id="typeturkort"><option value="turer" selected="selected">turer</option><option value="timer">timer</option></select><select id="typetidkort"><option value="ukentlig">pr. uke</option><option value="manedlig" selected="selected">pr. md.</option></select></li><li><div id="desc">Antall lengre turer<br/><em>(mer enn 1 time)</em></div><input type="text" id="langeturer" name="langeturer" value=""/><select id="typeturlang"><option value="turer" selected="selected">turer</option><option value="timer">timer</option></select><select id="typetidlang"><option value="ukentlig">pr. uke</option><option value="manedlig" selected="selected">pr. md.</option></select><div id="subforminputdelete"></div></li></ul></div>';

					transport_teller++;

					$('#klimakalkulatorwrapper #transportside #dagligtransportmiddel ul:first').append("<li>" + transportmiddel[currenttransportmiddel] + "</li>");

					$('#klimakalkulatorwrapper #transportside #dagligtransportmiddel input[type="text"]').ForceNumericOnly();

					Serum.Sandbox.refresh();
				});

				//Fjerne transportmiddel
				$(document).on("mousedown", "#klimakalkulatorwrapper #transportside #subforminputdelete", function(e) {
					e.stopPropagation();
					var currentIndex = $(this).closest("#subforminput").parent().index();
					var position =  $(this).closest("#subforminput").attr("pos");
					//transportkalkulasjon[currentIndex].transportmiddel = "";
					//transportkalkulasjon[currentIndex].CO2 = 0;
					transportkalkulasjon[position].transportmiddel = "";
					transportkalkulasjon[position].CO2 = 0;
					transport_teller--;
					calculateTransportCO2();
					$(this).closest('#subforminput').parent().remove();
					Serum.Sandbox.refresh();
				});
				$(document).on("keyup", "#klimakalkulatorwrapper #transportside .bil input", function(e) {
					e.stopPropagation();
					var currentIndex = $(this).closest("#subforminput").parent().index();
					var km = Number($(this).val());
					var mil = km / 10;
					var literpermil = $(this).closest("#subforminput").parent().find("#litermil").val();
					var drivstofftype = $(this).parent().find('#drivstofftype').val();
					var bilCO2 = 0;
					if (drivstofftype == "el") {
						bilCO2 = (km * bilparameterCO2[drivstofftype]) / 1000;
					}
					else if (drivstofftype == "hybrid") {
						bilCO2 = (km * bilparameterCO2[drivstofftype]) / 1000;
					}
					else {
						bilCO2 = (mil * literpermil * bilparameterCO2[drivstofftype]) / 1000;
					}
					transportkalkulasjon[currentIndex].CO2 = bilCO2;
					calculateTransportCO2();
				});
				$(document).on('change','#klimakalkulatorwrapper #transportside .bil select',function(e){
					e.stopPropagation();
					var currentIndex = $(this).closest("#subforminput").parent().index();
					var mil = 0;
					var km = 0;
					var literpermil = 0;
					var drivstofftype = 0;
					km = (Number($(this).closest("#subforminput").parent().find('#bilkm').val()));
					mil = km / 10;
					literpermil = $(this).closest("#subforminput").parent().find('#litermil').val();
					drivstofftype = $(this).closest("#subforminput").parent().find('#drivstofftype').val();
					var bilCO2 = 0;
					if (drivstofftype == "el") {
						$(this).closest("#subforminput").parent().find('#litermil').attr('disabled', true);
						bilCO2 = (km * bilparameterCO2[drivstofftype]) / 1000;
					}
					else if (drivstofftype == "hybrid") {
						$(this).closest("#subforminput").parent().find('#litermil').attr('disabled', true);
						bilCO2 = (km * bilparameterCO2[drivstofftype]) / 1000;
					}
					else {
						$(this).closest("#subforminput").parent().find('#litermil').attr('disabled', false);
						bilCO2 = (mil * literpermil * bilparameterCO2[drivstofftype]) / 1000;
					}
					transportkalkulasjon[currentIndex].CO2 = bilCO2;
					calculateTransportCO2();
				});

				//FLY
				$(document).on("keyup", "#klimakalkulatorwrapper #transportside input", function(e) {
					e.stopPropagation();
					switch ($(this).attr('id')) {
						case 'flyvningerskandinavia': flykalkulasjon.skandinavia = Number($(this).val()) * flyparametereCO2.skandinaviareise * flyparametereCO2.skandinaviautslipp;
						break;
						case 'flyvningereuropa':flykalkulasjon.europa = Number($(this).val()) * flyparametereCO2.europareise * flyparametereCO2.europautslipp;
						break;
						case 'flyvningerinterkontinentalt': flykalkulasjon.interkontinental = Number($(this).val()) * flyparametereCO2.interkontinentalreise * flyparametereCO2.interkontinentalutslipp;
						break;
						default: return;
					}
					calculateTransportCO2();
				});

				//MAT
				$(document).on("keyup", "#klimakalkulatorwrapper #matside input", function(e) {
					e.stopPropagation();
					switch ($(this).attr('id')) {
						case 'kjottmiddag': matkalkulasjon.kjottmiddag = Number($(this).val()) * 52 * matparametereCO2.kjottmiddag * matparametereCO2.kgkjottmiddag;
						break;
						case 'fiskemiddag': matkalkulasjon.fiskemiddag = Number($(this).val()) * 52 * matparametereCO2.fiskemiddag * matparametereCO2.kgkjottmiddag;
						break;
						case 'vegetarmiddag': matkalkulasjon.vegetarmiddag = Number($(this).val()) * 52 * matparametereCO2.vegetarmiddag * matparametereCO2.kgkjottmiddag;
						break;
						default: return;
					}
					calculateMatCO2();
				});

				//ELARTIKKEL
				$(document).on("keyup", "#klimakalkulatorwrapper #elartikkelside input", function(e) {
					e.stopPropagation();
					switch ($(this).attr('id')) {
						case 'telefonkjop': elartikkelkalkulasjon.telefonkjop = Number($(this).val()) * 52 * elartikkelparameterCO2.telefonkjop * elartikkelparameterCO2.kgtelefon;
						break;
						case 'datamaskinkjop': elartikkelkalkulasjon.datamaskinkjop = Number($(this).val()) * 52 * elartikkelparameterCO2.datamaskinkjop * elartikkelparameterCO2.kgtelefon;
						break;
						case 'tvkjop': elartikkelkalkulasjon.tvkjop = Number($(this).val()) * 52 * elartikkelparameterCO2.tvkjop * elartikkelparameterCO2.kgtelefon;
						break;
						default: return;
					}
					calculateElartikkelCO2();
				});

				//STREAMING
				$(document).on("keyup", "#klimakalkulatorwrapper #streamingside input", function(e) {
					e.stopPropagation();
					switch ($(this).attr('id')) {
						case 'streamingantall': streamingkalkulasjon.streamingantall = Number($(this).val()) * 52 * streamingparameterCO2.streamingantall * streamingparameterCO2.kgstreaming;
						break;
					}
					calculateStreamingCO2();
				});

				//FORBRUK
				$(document).on("keyup", "#klimakalkulatorwrapper #forbrukside input", function(e) {
					e.stopPropagation();
					forbrukerkalkulasjon.utgifter = Number($(this).val());
					calculateForbrukCO2();
				});
				$(document).on("change", "#klimakalkulatorwrapper #forbrukside .forbruk input[type='radio']", function(e) {
					e.stopPropagation();
					forbrukerkalkulasjon.forbrukertype = $(this).val();
					calculateForbrukCO2();
				});

				//CALCULATE BOLIG
				function calculateBoligCO2(husstand) {
					if(husstand) {
					}
					boligCalc = true;
					var boligstrom = 0;
					var boligannet = 0;
					var boligCO2 = 0;
					var vedstromCO2 = 0;
					var vedfaktorkWh = 0;
					var utslippsfaktor = boligparametereCO2.utslippsfaktorstrom;
					var vedfaktor = 0;
					stromChecked = false;
					fjernvarmeChecked = false;
					fyringsoljeChecked = false;
					switch (boligkalkulasjon.oppvarmingskilde) {
						case 'strom': utslippsfaktor = boligparametereCO2.stromkwh;stromChecked=true;
						break;
						case 'fjernvarme': utslippsfaktor = boligparametereCO2.fjernvarmekwh;fjernvarmeChecked=true;
						break;
						case 'fyringsolje': utslippsfaktor = boligparametereCO2.fyringsoljekwh;fyringsoljeChecked=true;
						break;
						default: utslippsfaktor = boligparametereCO2.stromkwh;stromChecked=true;
					}
					if (boligkalkulasjon.stromforbruk !== "") {
						boligstrom = Number(boligkalkulasjon.stromforbruk);
					}
					/*if (boligkalkulasjon.typebolig !== "" && boligkalkulasjon.storrelse !== "" && boligstrom == 0)*/
					if (boligkalkulasjon.typebolig !== "" && boligkalkulasjon.storrelse !== "") {
						if (boligkalkulasjon.typebolig === 'leilighet') {
							//boligstrom = Number(boligkalkulasjon.storrelse) * boligparametereCO2.leilighetm2;
							boligstrom = Number(boligkalkulasjon.storrelse) * boligparametereCO2.boligoppv;
							boligannet = Number(boligkalkulasjon.storrelse) * boligparametereCO2.boligannet;
						}
						else if (boligkalkulasjon.typebolig === 'bolig') {
							//boligstrom = Number(boligkalkulasjon.storrelse) * boligparametereCO2.boligm2;
							boligstrom = Number(boligkalkulasjon.storrelse) * boligparametereCO2.boligoppv;
							boligannet = Number(boligkalkulasjon.storrelse) * boligparametereCO2.boligannet;
						}
					}
					if (vedChecked) {
						vedfaktorkWh = boligstrom * boligkalkulasjon.vedforbruk;
					}
					else {
						vedfaktorkWh = 0;
					}
					var vedCO2 = vedfaktorkWh * Number(boligparametereCO2.vedfyringkwh) / 1000;
					if (boligkalkulasjon.stromforbruk > 0) {
						boligstrom = Number(boligkalkulasjon.stromforbruk);
					}
					boligCO2 = (((boligstrom - vedfaktorkWh) * Number(utslippsfaktor)) + (vedfaktorkWh * Number(boligparametereCO2.vedfyringkwh))) / 1000;
					boligCO2 = boligCO2 + ((boligannet * boligparametereCO2.stromkwh) / 1000);
					boligCO2 = boligCO2 / boligkalkulasjon.husstandfaktor;
					kategoriResultat.bolig = Number(boligCO2);
					//boligCO2 = Number(boligCO2).toFixed(2);
					//boligCO2 = boligstrom * Number(utslippsfaktor);
					calculateTotal();
					$('#klimakalkulatorwrapper #resultatside #Boligco2resultat').html("Bolig: <b>" + boligCO2.toFixed(2) + "</b> tonn CO<sub>2</sub>");
				}

				//CALCULATE TRANSPORT
				function calculateTransportCO2() {
					transportCalc = true;
					var flyCO2 = 0;
					var transportCO2 = 0;
					flyCO2 = (flykalkulasjon.skandinavia + flykalkulasjon.europa + flykalkulasjon.interkontinental) / 1000;
					flyCO2 = flyCO2.toFixed(2);
					$.each( transportkalkulasjon, function( key, value ) {
						transportCO2 += transportkalkulasjon[key].CO2;
					});
					transportCO2 = transportCO2.toFixed(2);
					kategoriResultat.transport = Number(flyCO2) + Number(transportCO2);
					calculateTotal();
					$('#klimakalkulatorwrapper #resultatside #Transportco2resultat').html("Transport: <b>" + kategoriResultat.transport.toFixed(2) + "</b> tonn CO<sub>2</sub>" );
				}

				//CALCULATE MAT
				function calculateMatCO2() {
					matCalc = true;
					var matCO2 = 0;
					matCO2 = (matkalkulasjon.kjottmiddag + matkalkulasjon.fiskemiddag + matkalkulasjon.vegetarmiddag) / 1000;
					matCO2 = matCO2 + matkalkulasjon.annet;
					matCO2 = matCO2.toFixed(2);
					kategoriResultat.mat = Number(matCO2);
					calculateTotal();
					$('#klimakalkulatorwrapper #resultatside #Matco2resultat').html("Mat: <b>" + matCO2 + "</b> tonn CO<sub>2</sub>");
				}

				//CALCLUATE ELARTIKLER
				function calculateElartikkelCO2() {
					elartikkelCalc = true;
					var elartikkelCO2 = 0;
					elartikkelCO2 = (elartikkelkalkulasjon.telefonkjop + elartikkelkalkulasjon.datamaskinkjop + elartikkelkalkulasjon.tvkjop) / 1000;
					elartikkelCO2 = elartikkelCO2 + elartikkelkalkulasjon.annet;
					elartikkelCO2 = elartikkelCO2.toFixed(2);
					kategoriResultat.elartikkel = Number(elartikkelCO2);
					calculateTotal();
					$('#klimakalkulatorwrapper #resultatside #Elartikkelco2resultat').html("Elartikkel: <b>" + elartikkelCO2 + "</b> tonn CO<sub>2</sub>");
				}

				//CALCULATE STREAMING
				function calculateStreamingCO2() {
					streamingCalc = true;
					var streamingCO2 = 0;
					streamingCO2 = (streamingkalkulasjon.streamingantall) / 1000;
					streamingCO2 = streamingCO2 + streamingkalkulasjon.annet;
					streamingCO2 = streamingCO2.toFixed(2);
					kategoriResultat.streaming = Number(streamingCO2);
					calculateTotal();
					$('#klimakalkulatorwrapper #resultatside #Elartikkelco2resultat').html("Elartikkel: <b>" + elartikkelCO2 + "</b> tonn CO<sub>2</sub>");
				}
				//CALCULATE FORBRUK
				function calculateForbrukCO2(husstand) {
					forbrukCalc = true;
					if(husstand == 1) {
						kategoriResultat.forbruk / boligkalkulasjon.husstandfaktor;
					}
					var forbrukCO2 = 0;
					var nettobruk = forbrukerkalkulasjon.nettoinntekt - forbrukerkalkulasjon.utgifter;
					var forbruk_gjennomsnitt = (nettobruk *  forbrukparametereCO2.gjennomsnittfaktor);
					$('#klimakalkulatorwrapper #forbrukside .radio #forbruklabel:eq(0)').html('(ca ' + (forbruk_gjennomsnitt * forbrukparametereCO2.undersnitt).toFixed(0) + ' kr mnd.)');
					$('#klimakalkulatorwrapper #forbrukside .radio #forbruklabel:eq(1)').html('(ca ' + (forbruk_gjennomsnitt * forbrukparametereCO2.snitt).toFixed(0) + ' kr mnd.)');
					$('#klimakalkulatorwrapper #forbrukside .radio #forbruklabel:eq(2)').html('(ca ' + (forbruk_gjennomsnitt * forbrukparametereCO2.oversnitt).toFixed(0) + ' kr mnd.)');
					forbruk_gjennomsnitt = forbruk_gjennomsnitt * forbrukerkalkulasjon.forbrukertype;
					forbrukC02 = ((forbruk_gjennomsnitt * forbrukparametereCO2.utslippsfaktorforbruk_krone) * 0.001) * 12;
					forbrukC02 = forbrukC02 / boligkalkulasjon.husstandfaktor;
					kategoriResultat.forbruk = forbrukC02;
					calculateTotal();
					$('#klimakalkulatorwrapper #resultatside #Forbrukco2resultat').html("Forbruk: <b>" + forbrukC02.toFixed(2) + "</b> tonn CO<sub>2</sub>");
				}

				//CALCULATE TOTAL
				function calculateTotal() {
					kategoriResultat.total = Number(kategoriResultat.bolig) + Number(kategoriResultat.transport) + Number(kategoriResultat.mat) + Number(kategoriResultat.elartikkel) + Number(kategoriResultat.streaming) + Number(kategoriResultat.forbruk);
					showResult(kategoriResultat.total);
					kategoriResultat.total = kategoriResultat.total.toFixed(2);
					var boligprosent = Number(kategoriResultat.bolig) / kategoriResultat.total;
					var transportprosent = Number(kategoriResultat.transport) / kategoriResultat.total;
					var matprosent = Number(kategoriResultat.mat) / kategoriResultat.total;
					var elartikkelprosent = Number(kategoriResultat.elartikkel) / kategoriResultat.total;
					var streamingprosent = Number(kategoriResultat.streaming) / kategoriResultat.total;
					var forbrukprosent = Number(kategoriResultat.forbruk) / kategoriResultat.total;
					$('#klimakalkulatorwrapper #resultatside #Totalco2resultat').html("Totalt forbruk: <b style='text-decoration:underline'>" + kategoriResultat.total + "</b> tonn CO<sub>2</sub>");
					showPercentage(boligprosent,transportprosent,matprosent,elartikkelprosent,streamingprosent,forbrukprosent);
					Serum.Sandbox.refresh();
					if(boligCalc && transportCalc && matCalc && elartikkelCalc && streamingCalc &&forbrukCalc && initFormCalc != true) {
						initForm();
						initFormCalc = true;
						setTekst();
						Serum.Sandbox.refresh();
					}
					else if (initFormCalc) {
						setTekst();
						Serum.Sandbox.refresh();
					}
					else {
						return;
					}
					//Serum.Sandbox.refresh();
				}
			});
