/*!
 * This JS file is used to envelope AJAX http request
 * version: 1.00 (14-AUG-2012)
 * @requires jQuery v1.7.2 or later
 */
(function($) {
	var isTimeout = false;
	//initial datatable element
	oTable = null;
	aaData = [];
	reviewEventsUIDArray=[];
	gloableActionString="";
	uploadActionString="<div class='upload' title='Upload attachment'><i class='icon-arrow-up icon-large'></i></div>";
	var uploadInvoiceState="";
	//build a ajax request and return the response
	//now it is used to raise a search request and show the result

	
	this.ajaxCall = function(url){
		onStart();
		
		
		jQuery.getJSON(
			url, // portlet resource url
			{},
			function(response) {
				// AJAX Response.
				//below java scripts is just for demo, you can define your own logic here.
				//console.log(reso)
				if(response == null){
					var messageDiv = document.getElementById("displayMessage");
					messageDiv.style.color="red";
					messageDiv.style.backgroundColor='#ff0000';
					if(oTable != undefined && oTable != null){
						oTable.fnClearTable();
					}
					//$("#displayMessage").html($("#noDateReceived").val());
					alertMessagePop ("displayMessage","Error",$("#noDateReceived").val());
					return false;
				}else{
					try{
						if(response.entity != undefined && response.entity != "" && response.entity!= null  ){
							//get the json object then generate the result datatable
							response = eval(response.entity);
							var resultTable = $("#result_table");
							resultTable.empty();
							resultTable.append("<table id='search_result' class='TableBackground search_result' align='center'></table>");
							var table = $("table#search_result");

							var userTenantValue = $("#userTenant").val()
							//console.log(userTenantValue);
                        	if(userTenantValue=="HPE" || userTenantValue=="ESV" || userTenantValue=="HPQ" ){  
						   		table.append("<thead><tr class='TableHeaderRow'><th name='checkboxColm'><input type='checkbox' name='selectAll' id='selectAll'/></th><th name='statusLight'></th><th id='action' name='action'><div class='actionHeaderIcon'><i class='icon-cog icon-large Cblue' title='Actions'></i></div></th><th name='reviewEvents'>"+$("#reviewEvents").val()+"</th><th name='invoiceName'>"+$("#invoiceNumberHeader").val()+"</th><th name='invoiceDate'>"+$("#invoiceDateHeader").val()+"</th>"+
						   			"<th name='invoiceReceivedDate'>"+$("#invoiceReceivedDateHeader").val()+"</th><th name='invoiceState'>"+$("#invoiceStateHeader").val()+"</th><th name='externalstatus'>External Status </th><th name='customerId'>"+$("#customerIdHeader").val()+"</th><th name='customerPoNumber'>"+$("#customerPoNumberHeader").val()+"</th>"+
						   			"<th name='customerName'>"+$("#customerNameHeader").val()+"</th><th name='hpOrderName'>"+$("#hpSapOrderNumberHeader").val()+"</th><th name='totalPaymentDueDate'>"+$("#totalPaymentDueDateHeader").val()+"</th><th name='totalAmount'>"+$("#totalAmountHeader").val()+"</th><th name='currency'>"+$("#currencyHeader").val()+"</th><th name='batchId'>"+$("#batchIdHeader").val()+"</th><th name='transmissiondt'>"+$("#transmissionDate").val()+"</th>"+
						   			"<th name='businessOperationModel'>"+$("#businessOperationModelHeader").val()+"</th><th name='invoiceType'>"+$("#invoiceTypeHeader").val()+"</th>" +"<th name='country'>Invoice To Country</th>"+
						   			"<th name='soldtocountrycd'> Sold To Country</th>"+"<th name='shiptocountrycd'> Ship To Country</th>"+
						   			"<th name=invoiceUID ''> InvoiceUID </th>"+
						   			"<th name=id ''> EDM ID</th>"+
						   			"<th name=localcountryinvno''> Local Country Invoice # </th>"+
						   			"<th name=invsrc''> Source System </th>"+
						   			"<th name=companyCode''> Company Code </th>"+
						   			// "<th name=companyCode''>External Status </th>"+
						   			"<th name=idocnum''> Idoc# </th>"+
						   			"</tr></thead><tbody>");
					        } else {								
								table.append("<thead><tr class='TableHeaderRow'><th name='checkboxColm'><input type='checkbox' name='selectAll' id='selectAll'/></th><th name='statusLight'></th><th id='action' name='action'><div class='actionHeaderIcon'><i class='icon-cog icon-large Cblue' title='Actions'></i></div></th><th name='reviewEvents'>"+$("#reviewEvents").val()+"</th><th name='invoiceName'>"+$("#invoiceNumberHeader").val()+"</th><th name='invoiceDate'>"+$("#invoiceDateHeader").val()+"</th>"+
									"<th name='invoiceReceivedDate'>"+$("#invoiceReceivedDateHeader").val()+"</th><th name='invoiceState'>"+$("#invoiceStateHeader").val()+"</th><th name='customerId'>"+$("#customerIdHeader").val()+"</th><th name='customerPoNumber'>"+$("#customerPoNumberHeader").val()+"</th>"+
									"<th name='customerName'>"+$("#customerNameHeader").val()+"</th><th name='hpOrderName'>"+$("#hpSapOrderNumberHeader").val()+"</th><th name='totalPaymentDueDate'>"+$("#totalPaymentDueDateHeader").val()+"</th><th name='totalAmount'>"+$("#totalAmountHeader").val()+"</th><th name='currency'>"+$("#currencyHeader").val()+"</th><th name='batchId'>"+$("#batchIdHeader").val()+"</th><th name='transmissiondt'>"+$("#transmissionDate").val()+"</th>"+
									"<th name='businessOperationModel'>"+$("#businessOperationModelHeader").val()+"</th><th name='invoiceType'>"+$("#invoiceTypeHeader").val()+"</th>" +"<th name='country'>Invoice To Country</th>"+
									"<th name='soldtocountrycd'> Sold To Country</th>"+"<th name='shiptocountrycd'> Ship To Country</th>"+
									"<th name=invoiceUID ''> InvoiceUID </th>"+
									"<th name=id ''> EDM ID</th>"+
									"<th name=localcountryinvno''> Local Country Invoice # </th>"+
									"<th name=invsrc''> Source System </th>"+
									"<th name=companyCode''> Company Code </th>"+								
									"<th name=idocnum''> Idoc# </th>"+
									"</tr></thead><tbody>");
						    }

							aaData = [];  
							reviewEventsUIDArray=[];
							if(response.length == 0){
								var messageDiv = document.getElementById("displayMessage");
								messageDiv.style.color="red";
								//messageDiv.style.backgroundColor='#ff0000';
								if(oTable != undefined && oTable != null){
									oTable.fnClearTable();
								}
								//$("#displayMessage").html($("#noDateCanBeReceived").val());
								alertMessagePop ("displayMessage","Error",$("#noDateCanBeReceived").val());
								$("#selectAll").remove();
							
							}else{
								var edm_id = "";
								//set the response data into an array then it can be added into datatable						
								for (var i = 0; i < response.length; i++){
									if (response[i].index!=undefined){
										edm_id = response[i].id;
										data=response[i].index;
										var tenant = (response[i].tenantId==""||response[i].tenantId==null)?"HPQ":response[i].tenantId;
										var actionStr = "";
										var BDOType = response[i].name;
										gloableActionString="";
										var uploadCountry = data.invtocountrycd;
										uploadInvoiceState=response[i].state;
										if(viewAuthority){
											gloableActionString = gloableActionString+"<div class='downloadInvoice' title='"+$("#viewAndDownloadLinkTitle").val()+"'><i class='icon-arrow-down icon-large'></i></div>";
										}
										if(historyAuthority){
											gloableActionString = gloableActionString+"<div class='viewHistory' title='"+$("#viewHistoryTitle").val()+"'><i class='icon-search icon-large'></i></div>";
										}
										if(duplicateCheckAuthority){
											gloableActionString = gloableActionString+"<div class='checkDuplicate' title='"+$("#duplicateCheckIconTitle").val()+"'><i class='icon-off icon-large'></i></div>";
										}
										if (reprocessAuthority) {
											gloableActionString = gloableActionString+"<div class='reprocess' title='"+$("#reprocessIconTitle").val()+"'><i class=' icon-repeat '></i></div>";
										}
										if (cancelAuthority) {
											gloableActionString = gloableActionString+"<div class='cancel' title='"+$("#cancelAction").val()+"'><i class='icon-ban-circle'></i></div>";
										}
										if (copyAuthority) {
											gloableActionString = gloableActionString+"<div class='copy' title='Copy invoice'><i class='icon-copy-2'></i></div>";
										}
										var invoiceUID = data.invoiceUID;
										if(tenant=="HPI" && BDOType=="DDSEnterpriseSalesInvoice"){
											invoiceUID = data.ddsInvoiceUID;
										}
										actionStr = "<div class='actionColumn'><div class='actionIcon' value='"+invoiceUID+"' tenant='"+tenant+"' BDOType='"+BDOType+"' docType='"+data.doctype+"' country='"+uploadCountry+"' uploadInvoiceState='"+uploadInvoiceState+"'><i class='icon-cog icon-large Cblue' title='Action'></i></div></div>";
										var checkboxStrng="";
										var cellForReviewEvents="";
										if(data.reviewEvents != undefined && data.reviewEvents == "true"){
											var spinnerPath=$("#spinnerPath").val();
											if(tenant=="HPI" && BDOType=="DDSEnterpriseSalesInvoice"){
												checkboxStrng+="<input type='checkbox' name='checkColm' value='"+invoiceUID+"' disabled='disabled' tenant='"+tenant+"' BDOType='"+BDOType+"' class='needReviewEvent' />";
											}else{
												checkboxStrng+="<input type='checkbox' name='checkColm' value='"+invoiceUID+"' tenant='"+tenant+"' BDOType='"+BDOType+"' class='needReviewEvent' />";
											}
											
											// cellForReviewEvents="<img src='/resource3/qtca/"+currentResourceVersion+"/images/ajax-loader.gif'/>";
											cellForReviewEvents='<img class="spingif" src="/resource3/common/'+spinnerPath+'/images/spinning2.gif"/></img>';
										}else{
											if(tenant=="HPI" && BDOType=="DDSEnterpriseSalesInvoice"){
												checkboxStrng+="<input type='checkbox' name='checkColm' value='"+invoiceUID+"' disabled='disabled' tenant='"+tenant+"'/>";
											}else{
												checkboxStrng+="<input type='checkbox' name='checkColm' value='"+invoiceUID+"' tenant='"+tenant+"'/>";
											}
										}
										//save two  decimals
										var totmt = new Number(data.totamt) ;										
										var invto = findJsonVaByKey(data.invtocountrycd,country);
										var soldto = 	findJsonVaByKey(data.soldtocountrycd,country);
										var shipto = 	findJsonVaByKey(data.shiptocountrycd,country);

										var userTenantValue = $("#userTenant").val()
										console.log(userTenantValue);
										if(userTenantValue=="HPE" || userTenantValue=="ESV" || userTenantValue=="HPQ" ){											
											aaData.push([												
												checkboxStrng,
												response[i].stateDecoration,											
												"<ul id='icons' class='ui-widget ui-helper-clearfix'>"+actionStr+"</ul>",	
												cellForReviewEvents,											
												data.invid,
												data.invdt,
												convertUndefinedValue(data.invrecvdt),
												response[i].state,
												data.externalstatus,
												data.custid,
												//"",//"A(2) R(3)",//data.reviewEvents,
												data.custpo,
												data.custnm,
												data.hporder,
												data.payduedt,
												totmt.toFixed(2),
												data.curr,
												data.batchid,
												convertUndefinedValue(data.transmissiondt),
												data.busopmodl,
												data.invtp,
												invto,
												soldto,
												shipto,
												invoiceUID,
												edm_id,
												data.localcountryinvno,
												data.invsrc,												
												data.companyCode,
												data.idocnum
											]);
										}else{
											aaData.push([												
												checkboxStrng,
												response[i].stateDecoration,											
												"<ul id='icons' class='ui-widget ui-helper-clearfix'>"+actionStr+"</ul>",	
												cellForReviewEvents,											
												data.invid,
												data.invdt,
												convertUndefinedValue(data.invrecvdt),
												response[i].state,
												data.custid,
												//"",//"A(2) R(3)",//data.reviewEvents,
												data.custpo,
												data.custnm,
												data.hporder,
												data.payduedt,
												totmt.toFixed(2),
												data.curr,
												data.batchid,
												convertUndefinedValue(data.transmissiondt),
												data.busopmodl,
												data.invtp,
												invto,
												soldto,
												shipto,
												invoiceUID,
												edm_id,
												data.localcountryinvno,
												data.invsrc,
												data.companyCode,
												data.idocnum
											]);
										}
									} 
								}
								var messageDiv = document.getElementById("displayMessage");
								messageDiv.style.color="green";
								//$("#displayMessage").html($("#searchResultMessageComment1").val()+" "+(response.length)+" "+$("#searchResultMessageComment2").val());
								alertMessagePop ("displayMessage","Success",$("#searchResultMessageComment1").val()+" "+(response.length)+" "+$("#searchResultMessageComment2").val());
							}
							table.append("</tbody>");
							var aaColumns;
							//set fit column width for different browser
							if(userTenantValue=="HPE" || userTenantValue=="ESV" || userTenantValue=="HPQ" ){
								console.log(userTenantValue);
								aaColumns = [
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.01*totalTableWidth },
									{"sWidth": 0.13*totalTableWidth },
									{"sWidth": 0.01*totalTableWidth},
									{"sWidth": 0.04*totalTableWidth },
									{"sWidth": 0.07*totalTableWidth },
									{"sWidth": 0.11*totalTableWidth },
									{"sWidth": 0.14*totalTableWidth },
									{"sWidth": 0.06*totalTableWidth },
									{"sWidth": 0.05*totalTableWidth},
									{"sWidth": 0.16*totalTableWidth },
									{"sWidth": 0.07*totalTableWidth },
									{"sWidth": 0.01*totalTableWidth },
									{"sWidth": 0.05*totalTableWidth ,"sType":"num-html"},
									{"sWidth": 0.10*totalTableWidth },
									{"sWidth": 0.05*totalTableWidth},
									{"sWidth": 0.02*totalTableWidth},
									{"sWidth": 0.10*totalTableWidth},
									{"sWidth": 0.14*totalTableWidth },
									{"sWidth": 0.08*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth }
								];								
							}else{
								aaColumns = [
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.01*totalTableWidth },
									{"sWidth": 0.13*totalTableWidth },
									{"sWidth": 0.01*totalTableWidth},
									{"sWidth": 0.04*totalTableWidth },
									{"sWidth": 0.07*totalTableWidth },
									{"sWidth": 0.11*totalTableWidth },
									{"sWidth": 0.14*totalTableWidth },
									{"sWidth": 0.06*totalTableWidth },
									{"sWidth": 0.05*totalTableWidth},
									{"sWidth": 0.16*totalTableWidth },
									{"sWidth": 0.07*totalTableWidth },
									{"sWidth": 0.01*totalTableWidth },
									{"sWidth": 0.05*totalTableWidth ,"sType":"num-html"},
									{"sWidth": 0.10*totalTableWidth },
									{"sWidth": 0.05*totalTableWidth},
									{"sWidth": 0.02*totalTableWidth},
									{"sWidth": 0.10*totalTableWidth},
									{"sWidth": 0.14*totalTableWidth },
									{"sWidth": 0.08*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth },
									{"sWidth": 0.02*totalTableWidth }
								];
								
							}

							$.fn.dataTableExt.oJUIClasses.sSortJUI ="css_right icon-sort";
						    $.fn.dataTableExt.oJUIClasses.sSortJUIAsc ="css_right icon-sort-up";
						    $.fn.dataTableExt.oJUIClasses.sSortJUIDesc ="css_right icon-sort-down";   
							//initial some properties for the result datatable and then convert the html table to datatable
							oTable=null;
							oTable = $("table#search_result").dataTable({
								"aaSorting": [[ 5, "desc" ]],
								"aaData": aaData,
								//pagination style 
								// "sPaginationType" : "full_numbers",
								"sPaginationType" : "commonStandard",
								"bPaginate" :true,
								"bJQueryUI": true,
								"bRetrieve": true, 
								"bDestroy": true, 
								// "sDom": 'R<"H"Cfr>tlpi',
								// "sDom":'<"t_header"Cifr<"clear">><"t_body"t><"t_footer"lp>',
								"sDom": '<"t_header"rClf><"t_body"t><"t_footer"pi>',
								

								//scroll record
								//"sScrollY": "200px",
								//"sDom": "frtiS",
								//"bDeferRender": true,
								"bSortClasses": false,
								"aoColumns": aaColumns,
								"aoColumnDefs": [

									{ "sClass": "filterInputMultiColumn", "aTargets": [ 7,14,17,18 ] }, 
									{ "sClass": "center thcenter", "aTargets": [ 0 ] },
									{ "sClass": "center", "aTargets": [ 3 ] },
									{ "sClass": "right", "aTargets": [ 13 ] },
									{ "bSortable": false, "aTargets": [ 0,1,2] },
									{"sDefaultContent" : '',"aTargets" : [ '_all' ]}
									// ,
									// { "bVisible": false, "aTargets": [ 12 ,20,21,22,23,24] }
								],

								"oLanguage": {

						        	"sLengthMenu": "<div class='sLengthText'>View Results of</div> _MENU_ ",
						        	"sInfo": "<span class='number_highlight'>_TOTAL_</span> items <span class='number_highlight'>_TOTALPAGE_</span> pages",
						        	"sInfoFiltered": "",
						        	"sSearch": "Filter:",
						        	"sInfoEmpty":"<span class='number_highlight'>0</span> items, <span class='number_highlight'>0</span> pages",
							        "oPaginate": {      // define pagination button style
							          "sFirst":  "<i class='icon-double-angle-left'></i>",
							          "sLast":  "<i class='icon-double-angle-right'></i>",
							          "sNext":  "<i class='icon-angle-right'></i>",
							          "sPrevious":  "<i class='icon-angle-left'></i>"
						        }
								},
								// "oLanguage": {
								// 	"sSearch": "",
								// 	"sLengthMenu": "<div class='sLengthText'>View Results of</div> _MENU_ ",
								// 	// "sLengthMenu": $("#lengthMenuForTable").val(),
								// 	"sZeroRecords": $("#zeroRecordsForTable").val(),
								// 	"sInfo": $("#informationForTable").val(),
								// 	"sInfoEmpty": $("#infoEmptyForTable").val(),
								// 	// "oPaginate": {
								// 	//     "sFirst":  $("#firstPageForTable").val(),
								// 	// 	"sLast":  $("#lastPageForTable").val(),
								// 	// 	"sNext":  $("#nextPageForTable").val(),
								// 	// 	"sPrevious":  $("#previousPageForTable").val()
								// 	// }
								// 	"oPaginate": { // define pagination button style
								// 	"sFirst": "<i class='icon-double-angle-left'></i>",
								// 	"sLast": "<i class='icon-double-angle-right'></i>",
								// 	"sNext": "<i class='icon-angle-right'></i>",
								// 	"sPrevious": "<i class='icon-angle-left'></i>"
								// 	}
								
								// "oColVis": {
								// 	"buttonText": $("#showHideLabelForTable").val()+'<i class="icon-caret-down"></i>',
								// 	"aiExclude": [ 0,1 ],
								// 	"sAlign":"right"
								// },

								// "oColVis": { // define show/hide function style
								// "buttonText": 'Show/Hide columns <i class="icon-angle-down"></i>',
								// "aiExclude": [ 0 ],
								// "sAlign":"right"
								// } ,
								 "oColVis": {        // define show/hide function style
				//		        "buttonText": 'Show/Hide Column <i class="icon-chevron-down"></i>',
						        "aiExclude": [ 0 ,1],
						        "bShowAll": true,
						        "sShowAll": "Show All",
						        "sAlign":"left"
						       } ,



								"fnDrawCallback": function() {
									$.unblockUI();
									if(typeof oTable != 'undefined' && oTable != null){									
										retrieveEventsFromBackend();
									}
								}
							});
							// $("#search_result_last").after($("#search_result_info"));
							$("#search_result_length select").selecter({bAlpha:false});

						createFilterRow(oTable);
						$(".filterRow input.dateFilter").datepicker({
							dateFormat: 'yy-mm-dd',//define the date format
							onClose: function(){
								oTable.fnFilter( this.value, $(".TableHeaderRow th").index($(this).parent().parent()), false, true,true,true );
							}
						});
						oTable.fnSetColumnVis( 12, false );
						oTable.fnSetColumnVis( 20, false );
						oTable.fnSetColumnVis( 21, false );
						oTable.fnSetColumnVis( 22, false );
						oTable.fnSetColumnVis( 23, false );
						oTable.fnSetColumnVis( 24, false );
						oTable.fnSetColumnVis( 25, false );
						oTable.fnSetColumnVis( 26, false );
						oTable.fnSetColumnVis( 27, false );
				
							//$("#customerFilter").empty();
							// $("#filterInput").empty();
							// $("#showHideDiv").empty();
							// $("#filterInput").append($("#search_result_filter"));
							// $("#filterIcon").show();
							// $("#showHideDiv").append($("div.TableTools"));
							$("input[name='checkColm']").click(function(){

								var undefinedCulm = $("input[name='checkColm'][checked!='checked']"); 
								
								if(undefinedCulm.length == 0){
									$("#selectAll").prop("checked", true);
								}
								else{
									$("#selectAll").prop("checked", false);
								}
							});
							$("#selectAll").click(function(){
									if ($('#selectAll').prop("checked") == true) {
										$("#selectAll").prop("checked", true);
										$('input[name="checkColm"][disabled!="disabled"]').prop('checked',true);
									}
									else{
										$("#selectAll").prop("checked", false);
										$('input[name="checkColm"]').prop('checked',false);
									}
								});
							//$("#search_result").show();
							if(copyAuthority  ){				
								var  copyAllBtn="<a class='dataTables_reprocesscancel' id='copyAllBtn' href='#'  style='color:#fff;margin-left:4px;' title='Bulk copy'><i class='icon-copy-2' style='margin-right:5px;font-size:13px;' ></i>Copy</a>";
								$("#search_result_length").after(copyAllBtn);
							}
							if(cancelAuthority ){ 
				
									var cancelAllBtn  = " <a class='dataTables_reprocesscancel' id='cancelAllBtn' href='#' style='color:#fff;'  title='Bulk cancel'><i class='icon-ban-circle'  style='margin-right:5px;'></i>Cancel</a>";
				 						$("#search_result_length").after(cancelAllBtn);
						 				
							}
							if(reprocessAuthority  ){				
								var  reprocessAllBtn="<a class='dataTables_reprocesscancel' id='reprocessAllBtn' href='#'  style='color:#fff;margin-left:20px;' title='Bulk reprocess'><i class='icon-repeat' style='margin-right:5px;' ></i>Reprocess</a>";
								$("#search_result_length").after(reprocessAllBtn);
							}
							
					
							
						}else if(response.entity == ""){
							var messageDiv = document.getElementById("displayMessage");
							messageDiv.style.color="red";
							if(oTable != undefined && oTable != null){
								oTable.fnClearTable();
							}
							//$("#displayMessage").html($("#noDateCanBeReceived").val());
							alertMessagePop("displayMessage","Error",$("#noDateCanBeReceived").val());
							
						}else{
							var messageDiv = document.getElementById("displayMessage");
							messageDiv.style.color="red";
							if(oTable != undefined && oTable != null){
								oTable.fnClearTable();
							}
							//$("#displayMessage").html(response.message);
							alertMessagePop ("displayMessage","Error",response.message);
							
						}
					}catch(e){
						jQuery.event.trigger("ajaxStop");
						var messageDiv = document.getElementById("displayMessage");
						messageDiv.style.color="red";
						if(oTable != undefined && oTable != null){
							oTable.fnClearTable();
						}
						//$("#displayMessage").html($("#exceptionInJs").val());
						alertMessagePop("displayMessage","Error",$("#exceptionInJs").val());
					
					}
				}
			}
		).error(function(jqXHR, textStatus, errorThrown) { 
			if(textStatus =='timeout'){
				document.getElementById("displayMessage").style.color="red";
				//$("#displayMessage").html(requestTimeOutMeg.replace("{0}","search"));
				alertMessagePop ("displayMessage","Error",requestTimeOutMeg.replace("{0}","search"));
				isTimeout = true;
			}else{
				document.getElementById("displayMessage").style.color="red";
				//$("#displayMessage").html("Data service is not available. No data returned");
				alertMessagePop("displayMessage","Error","Data service is not available. No data returned");
			
			}
		})
		.complete(function(event,xhr,options) {
			$("#loading_page").hide();
			$("#exportCSVButton").show();
			$("#menuTools_Div").hide();
		
			  
			if(typeof oTable != 'undefined' && oTable != null){
				retrieveEventsFromBackend();
			}
			// $("#search_result_wrapper div:eq(0)").remove();
			if(!isTimeout){
				isTimeout = false;
				if(event.status == 302||event.status == 0){
			   		window.location.reload(); 
				}else if(event.status != 200){
					var messageDiv = document.getElementById("displayMessage");
					//messageDiv.style.color="red";
					if(oTable != undefined && oTable != null){
						oTable.fnClearTable();
					}
					$("#displayMessage").html($("#dataServiceNotAvailable").val());
					return false;
				//	alertMessagePop ("displayMessage","Error",$("#dataServiceNotAvailable").val());
				}
			}
			return false;
		});

	};	
	    function configMessage(divId,color,message){
         if($("#"+divId) != undefined){
             $("#"+divId).css({color:color});
             $("#"+divId).html(message);
         }
    }

  function alertMessagePop(divId, status, messages){       
        if ( messages=="" || messages==undefined) {
            configMessage(divId,"green","")
            $("#alertMessagePop").hide();    
            return false;
        }
        $("#alertMessage").attr("class","alert");
        $("#alertMessage").addClass(status.toLowerCase());
        $("#alertMessage").html(status + ": "+ messages);
        var sh = document.documentElement.scrollTop || document.body.scrollTop;
        var wh=window.innerHeight|| window.wHeight;
        $("#alertMessagePop").css("top",sh+(wh/2)+"px");
        $("#alertMessagePop").css("opacity","1");
        $("#alertMessagePop").show();                
        setTimeout(function(){
            $("#alertMessagePop").animate({
               opacity: "0"
             }, {duration: 1000,
             complete:function(){
                $("#alertMessagePop").hide(); 
                if(status == "Error" || status == "Warning"){
                    configMessage(divId,"red",messages);
                }
                else{
                    configMessage(divId,"green",messages);
                }
             }
         });
        }, 2000);  

	}	
	



function findJsonVaByKey(keyStr,json){
 	for(var key in json){
            try{
                var value = json[key];
                if(value.code == keyStr)
                	return value.name;
               
            }catch(e){
            	return '';
            	}
        }
        return '';
      }	
	//alert(findJsonVaByKey('US',country));
	
	
	
})(jQuery);