/*!
 * This JS file for invoice view.jsp
 * version: 1.00 (20-Aug-2012)
 * @requires jQuery v1.7.2 or later
 */
(function($) {
	
	var batchReprocessUIDsList= new Array();
	var returnStatusList= new Array();
	var batchReprocessUIDs = '';
	var returnStatus = '';
	
	var batchCancelUIDsList= new Array();
	var cancelreturnStatusList= new Array();
	var batchCancelUIDs = '';
	var returnStatus = '';
	
	var batchCopyUIDsList = new Array();
	var copyInvoiceUID = null;
	var isUploadEnable=true;
	var maxSelectNum=str2Int(ajaxNumBatch,8);
	//gloable properties
	wWidth = $(window).width();
	totalTableWidth=wWidth*0.97;
	historyOTable = null;
	aaHistoryData = [];
	availableHistoryType=[];
	// availableOperations=[];
	// avaiableOperationAlreadyRetrieved=false;
	var reprocessAs = 'copy';//mark  reporcess as
	reprocessUid=null;
	var batchReprocessInvoiceIds=new Array();
	var batchReprocessInvoiceIdsmap = {};
	var undefinedCulm =[""];
	var batchCancelInvoiceIds={};
	var batchCopyInvoiceIds = new Array();
		
	cancelInvoiceUID=null;
	cancelInvoiceTenant=null;
	$(document).ajaxStop(onStop);
		
	function str2Int(i,def){
		var intI = parseInt(i);
		if(intI)
			return intI;
		else
			return def;
		}
	
	$.ajaxSetup({cache:false});
    $.ajaxSetup({
        timeout: str2Int(ajaxTimePeriodGlobal,125000)
    });
    var isTimeout = false;
	var historyTitle; 
	// checkProtocted = false;
	function onStop(event){
		// $("#loading_page").hide();
		$.unblockUI();

	}

	// this.checkIfOperationAuthorized = function (operation, warning) {
	// 	var authorized = "true";
	// 	var url = getOperateAuthorization();
	// 	url = url.replace('operationValue', operation);
		
	// 	$.ajax({
	// 		type:'post',
	// 		url:url,
	// 		dataType: 'json',
	// 		async: false,
	// 		success: function(response){
	// 			if(response.authorized != undefined && response.authorized != null && response.authorized !="" && response.authorized == "false") {
	// 				var messageDiv = document.getElementById("displayMessage");
	// 				messageDiv.style.color="red";
	// 				$("#displayMessage").html(warning);
	// 				authorized = "false";
	// 			}
	// 		}
	// 	});
	// 	return authorized != "false";
	// }
		//get all available operations for current user
	// this.checkIfOperationAuthorizedForCurrentUser =	function(methodName,warning){
	// 	if(!checkProtocted){
	// 		return true;
	// 	}
	// 	if(!avaiableOperationAlreadyRetrieved){
	// 		var url = getAllAuthorizedOperate();	
	// 		$.ajax({
	// 			type:'post',
	// 			url:url,
	// 			dataType: 'json',
	// 			async: false,
	// 			success: function(response){
	// 				if(response != undefined && response !="" && response.entity != undefined && response.entity!="") {
	// 					availableOperations = response.entity;
	// 					avaiableOperationAlreadyRetrieved = true;
	// 				}
	// 			}
	// 		});
	// 	}
	// 	//availableOperations = ["VIEW_INVOICE","REPROCESS","CACEL","RESUME","DOWNLOAD_INVOICE","VIEW_INVOICE_HISTORY","BYPASS_DUPLICATE_CHECK"];
	// 	if($.inArray(methodName, availableOperations) != -1){
	// 		return true;
	// 	}else{
	// 		if(warning != undefined){
	// 			var messageDiv = document.getElementById("displayMessage");
	// 			messageDiv.style.color="red";
	// 			$("#displayMessage").html(warning);
	// 		}
	// 	}
	// 	return false;
	// }
	
	this.batchCancelInvoice = function(cancelInvoiceUIDList){
		var cancelList = new Array();
		var tempList = $.toJSON(cancelInvoiceUIDList);
		var responseCancelUIDs = "";
		var returnStatus="";
		var messageDiv = document.getElementById("displayMessage");
		// tempList=tempList.replace(/\\\"/g,"'");
		// if(tempList.substring(0,1)=="\""){
		// 	tempList=tempList.substring(1, tempList.length - 1);
		// }
		// cancelList.push(tempList);
		var JSonUrl = getViewAndDownPortletUrl();
		JSonUrl = JSonUrl.replace('serviceName', "SalesInvoiceManager");
		JSonUrl = JSonUrl.replace('viewDownload', "cancelInvoice");
		JSonUrl = JSonUrl.replace('methodValue', "cancelInvoice");
        JSonUrl = JSonUrl.replace('paramA', "invoiceUID");
		JSonUrl = JSonUrl.replace('paramB', "operator");
        JSonUrl = JSonUrl.replace('paramValueA', tempList);
		JSonUrl = JSonUrl.replace('paramValueB', $("#sessionUserEmail").attr("value"));
		// if(cancelInvoiceUIDList.length<=1){
			JSonUrl = JSonUrl.replace('tenantValue', $("#actionDiv_InvoiceUID").attr("tenant"));
			JSonUrl = JSonUrl.replace('bdoTypeValue', $("#actionDiv_InvoiceUID").attr("BDOType"));
			
		// }
		onStart();
		$.ajax({
			type:'post',
			url:JSonUrl,
			dataType: 'json',
			timeout:str2Int(ajaxTimePeriodBatch,125000),
			success: function(response){ 
			
				// Handle AJAX Response.
				//You can define your own logic here
				var succFlag =0 ;
				var failFlag =0;
				batchReprocessUIDsList= new Array();
	 			returnStatusList= new Array();
				//response = {"authorized":"true","entity":[{"invoiceUID":"STG-HSHPSAMSUS20130070000808","status":"BX-701005: Process instance with id [pvm:0a122f02] cannot be found."}],"exception":"","message":""};

				if(response == null){
					//messageDiv.style.color="red";
					//$("#displayMessage").html($("#noResponseInCancel").val());
					alertMessagePop ("displayMessage","Error",$("#noResponseInCancel").val());
				}else{
					if(response.authorized != undefined && response.authorized !="" && response.authorized == "false") {
						//messageDiv.style.color="red";
						//$("#displayMessage").html($("#noPermissionToCancel").val());
						alertMessagePop ("displayMessage","Error",$("#noPermissionToCancel").val());
					}else{
						if(response.entity != undefined && response.entity != "" && response.entity!= null){
							response = eval(response.entity);							
							for (var i = 0; i < response.length; i++){
								returnStatus += response[i].status;
								if (!(returnStatus.indexOf("OK") >= 0 || returnStatus.indexOf("200")>=0)){
									failFlag ++;
									batchReprocessUIDsList.push(response[i].invoiceUID);
									returnStatusList.push( response[i].status);
								}else{
									succFlag ++;
									batchReprocessUIDsList.push(response[i].invoiceUID);
									returnStatusList.push( response[i].status);
								}
							}
							
							messageDiv.style.color="green";
							var displayMeg ="";
							if (succFlag == 0 && failFlag !=0 ){
								alertMessagePopNotDisMeg ("displayMessage","Error","Selected invoices  cancellation failed.","<a id='showAllMeg_cancel'  href='#'>Please click here to view result.</a>");				
							}
							 if(succFlag != 0 && failFlag !=0 ){
								alertMessagePopNotDisMeg ("displayMessage","Error","Selected invoiced cancellation partially succeeded.","<a id='showAllMeg_cancel'  href='#'>Please click here to view result.</a>");	
							}
							if(succFlag != 0 && failFlag ==0 ){
								alertMessagePopNotDisMeg ("displayMessage","Success","Selected invoices cancellation succeeded.","<a id='showAllMeg_cancel'   href='#'>Please click here to view result.</a>");
							}
					
							
							/*
							if(cancelInvoiceUIDList.length>1){
								$("#displayMessage").html($("#batchCancelInvoice").val()+ " " +$("#successfullyCanceled").val());
							}else{
								$("#displayMessage").html(responseCancelUIDs + " " +$("#successfullyCanceled").val());
							}*/
						}else{
							alertMessagePop ("displayMessage","Error",response.message);
						}
					}
				}
			},
			error:function(jqXHR, textStatus, errorThrown) { 
				if(textStatus =='timeout'){
					alertMessagePop ("displayMessage","Error",requestTimeOutMeg.replace("{0}","cancel invoice"));
					isTimeout = true;
					return false;
				}else{
					alertMessagePop ("displayMessage","Error","Data service is not available. No data returned");
				}
			
			},
			complete:function(event,xhr,options) {
				if(!isTimeout){
					isTimeout = false;
					if(event.status == 302 || event.status == 0){
			   			window.location.reload(); 
					}
				}
			}
		})
		};
	
		
	
	this.batchReprocessInvoice = function(reprocessList, isCopy){
		
		var reprocessFormatList = new Array();
		var tempList = $.toJSON(reprocessList);
		tempList=tempList.replace(/\\\"/g,"'");
		if(tempList.substring(0,1)=="\""){
			tempList=tempList.substring(1, tempList.length - 1);
		}
		reprocessFormatList.push(tempList);
		var JSonUrl = getPortletUrl();
		var method = "";
		
		$("#displayMessage").html("");
		var messageDiv = document.getElementById("displayMessage");
		var JSonUrlForReprocess = getViewAndDownPortletUrl();
		JSonUrlForReprocess = JSonUrlForReprocess.replace('serviceName', "SalesInvoiceManager");
        JSonUrlForReprocess = JSonUrlForReprocess.replace('viewDownload', "reprocessInvoice");
		JSonUrlForReprocess = JSonUrlForReprocess.replace('methodValue', "reprocessInvoice");
		//the two params will be send to backend as an array
        JSonUrlForReprocess = JSonUrlForReprocess.replace('paramA', "operator");
        JSonUrlForReprocess = JSonUrlForReprocess.replace('paramB', "isCopy");
        JSonUrlForReprocess = JSonUrlForReprocess.replace('paramC', "invoiceUID");
		JSonUrlForReprocess = JSonUrlForReprocess.replace('paramValueA', $("#sessionUserEmail").attr("value"));
		JSonUrlForReprocess = JSonUrlForReprocess.replace('paramValueB', isCopy);
		JSonUrlForReprocess = JSonUrlForReprocess.replace('paramValueC', tempList);
		if(reprocessList.length<=1){
			JSonUrlForReprocess = JSonUrlForReprocess.replace('tenantValue', $("#actionDiv_InvoiceUID").attr("tenant"));
			JSonUrlForReprocess = JSonUrlForReprocess.replace('bdoTypeValue', $("#actionDiv_InvoiceUID").attr("BDOType"));
			var docType = $("#actionDiv_InvoiceUID").attr("docType").trim();
			if($("#actionDiv_InvoiceUID").attr("BDOType")=="DDSEnterpriseSalesInvoice" && docType=="" ){
				alertMessagePop ("displayMessage","Error","doctype can not be null for DDS invoice, please check the invoice data first.");
				return false;
			}else{
				JSonUrlForReprocess = JSonUrlForReprocess.replace('docTypeValue', $("#actionDiv_InvoiceUID").attr("docType"));
			}
		}
		
		onStart();
		$.ajax({
			type:'post',
			url:JSonUrlForReprocess,
			dataType: 'json',
			timeout:str2Int(ajaxTimePeriodBatch,125000),
			success: function(response){
				// Handle AJAX Response.
				//You can define your own logic here
				var succFlag =0 ;
				var failFlag =0;
				batchReprocessUIDsList= new Array();
	 			returnStatusList= new Array();
				batchReprocessUIDs = '';
				returnStatus = '';
				//response = {"authorized":"true","entity":[{"invoiceUID":"dEV-HSHPSWWUS20130070000428","status":"500|Reprocess Completed Successfully"},{"invoiceUID":"dEV-HSHPSWWUS20130070000375","status":"Success|200|Reprocess Completed Successfully"},{"invoiceUID":"dEV-HSHPSWWUS20130070000433","status":"Success|200|Reprocess Completed Successfully"},{"invoiceUID":"dEV-HSHPSWWUS20130070000426","status":"Success|200|Reprocess Completed Successfully"},{"invoiceUID":"dEV-HSHPSWWUS20130070000425","status":"Success|200|Reprocess Completed Successfully"}],"exception":"","message":""};
				if(response == null){
					alertMessagePop ("displayMessage","Error",$("#noResponseInReprocess").val());
				}else{
					if(response.authorized != undefined && response.authorized !="" && response.authorized == "false") {
						alertMessagePop ("displayMessage","Error",$("#noPermissionToReprocessMessage").val());
					}else{
						if(response.entity != undefined && response.entity != "" && response.entity!= null){
							response = eval(response.entity);
							for (var i = 0; i < response.length; i++){
								batchReprocessUIDs +=( response[i].invoiceUID +$("#successfullyReprocessed").val());
								returnStatus = response[i].status;
								if (returnStatus.indexOf("Success") >= 0 ||  returnStatus.indexOf("200")>=0){
									succFlag ++;
									batchReprocessUIDsList.push(response[i].invoiceUID);
									returnStatusList.push( response[i].status);
								}else{
									failFlag ++;
									batchReprocessUIDsList.push(response[i].invoiceUID);
									returnStatusList.push( response[i].status);
									
								}
							}
							messageDiv.style.color="green";
							var displayMeg ="";
							if (succFlag == 0 && failFlag !=0 ){
								alertMessagePopNotDisMeg ("displayMessage","Error","Error occurred when trying to reprocess invoice.","<a id='showAllMeg'   href='#'>Click here to view result.</a>");				
							}
							 if(succFlag != 0 && failFlag !=0 ){
								alertMessagePopNotDisMeg ("displayMessage","Error","Invoices reprocess request is sent successfully.","<a id='showAllMeg'   href='#'>Click here to view result.</a>");	
							}
							if(succFlag != 0 && failFlag ==0 ){
								alertMessagePopNotDisMeg ("displayMessage","Success","Reprocessed successfully.","<a id='showAllMeg'   href='#'>Click here to view result.</a>");
							}
					
							/*
							if(reprocessList.length>1){
								$("#displayMessage").html($("#batchReprocessInvoice").val()+ " " +$("#successfullyReprocessed").val());
							}else{
								$("#displayMessage").html(batchReprocessUIDs + " " +$("#successfullyReprocessed").val());
							}
							
							*/
							
						}else{
							alertMessagePop ("displayMessage","Error",response.message);
						}
					}
				}
			},error:function(XMLHttpRequest, textStatus, errorThrown){

				if(textStatus =='timeout'){
					isTimeout == true;
					alertMessagePop ("displayMessage","Error",requestTimeOutMeg.replace("{0}","reprocess invoice"));
					return false;
				}else{
					alertMessagePop ("displayMessage","Error","Data service is not available. No data returned");
					return false;
				}
			},
			complete:function(event,xhr,options) {
				if(!isTimeout){
					isTimeout = false;
					if(event.status == 302 ||  event.status == 0){
			   			window.location.reload(); 
					}else if(event.status != 200){
						alertMessagePop ("displayMessage","Error",$("#serviceNotAvailableInReprocess").val());
					}
				}
			}
		});
	};

	$(document).on('click','#showAllMeg',function(event){
		event.stopPropagation(); 

		var mesgtext ="<table width='100%'> <tr><td width='40%' >Invoice UID</td><td width='15%' >Status</td><td width='40%' >Description</td></tr>";
		for(var i=0 ;i<batchReprocessUIDsList.length;i++){
			var reStatL = returnStatusList[i].split('|');
			if( reStatL[0] == undefined  )  reStatL[0] ='';
			if( reStatL[2] == undefined  )  reStatL[2] ='';
			if (!(returnStatusList[i].indexOf("OK") >= 0 || returnStatusList[i].indexOf("200")>=0)){
				mesgtext += ("<tr style='color:red'><td>" +batchReprocessUIDsList[i]+"</td><td>"+reStatL[0]+"</td><td>"+reStatL[2]+"</td></tr>");
			}else
				mesgtext += ("<tr style='color:green'><td>" +batchReprocessUIDsList[i]+"</td><td>"+reStatL[0]+"</td><td>"+reStatL[2]+"</td></tr>");
		}
		mesgtext +="</table>";
		$('#showReprocessMesg').html(mesgtext);
		$('#showReprocessMesg').dialog('open');
		return false;
	});

	$(document).on('click','#showAllMeg_cancel',function(event){
		event.stopPropagation(); 
		var mesgtext ="<table width='100%'> <tr><td width='40%' >Invoice UID</td><td width='45%' >Status</td></tr>";
		for(var i=0 ;i<batchReprocessUIDsList.length;i++){

			if (!(returnStatusList[i].indexOf("OK") >= 0 || returnStatusList[i].indexOf("200")>=0)){
				mesgtext += ("<tr style='color:red'><td>" +batchReprocessUIDsList[i]+"</td><td>"+returnStatusList[i]+"</td></tr>");
			}else
				mesgtext += ("<tr style='color:green'><td>" +batchReprocessUIDsList[i]+"</td><td>"+returnStatusList[i]+"</td></tr>");
		}
		mesgtext +="</table>";
		$('#showReprocessMesg').html(mesgtext);
		$('#showReprocessMesg').dialog('open');
		return false;
	});
	$(document).on('click','#showAllMeg_copy',function(event){
		event.stopPropagation(); 
		
		var mesgtext ="<table width='100%'> <tr><td width='40%' >Invoice UID</td><td width='15%' >Status</td><td width='40%' >Description</td></tr>";
		for(var i=0 ;i<batchCopyUIDsList.length;i++){
			var reStatL = returnStatusList[i].split('|');
			if( reStatL[0] == undefined  )  reStatL[0] ='';
			if( reStatL[2] == undefined  )  reStatL[2] ='';
			if (!(returnStatusList[i].indexOf("200") >= 0 || returnStatusList[i].indexOf("Success")>=0)){
				mesgtext += ("<tr style='color:red'><td>" +batchCopyUIDsList[i]+"</td><td>"+reStatL[0]+"</td><td>"+reStatL[2]+"</td></tr>");
			}else
				mesgtext += ("<tr style='color:green'><td>" +batchCopyUIDsList[i]+"</td><td>"+reStatL[0]+"</td><td>"+reStatL[2]+"</td></tr>");
		}
		mesgtext +="</table>";
		$('#showReprocessMesg').html(mesgtext);
		$('#showReprocessMesg').dialog('open');
		return false;
	});
	
	//retrieve reviewEvents from backend
	this.retrieveEventsFromBackend = function(){
		var sTring = "";
		//var reviewEventArray = $('input.needReviewEvent', oTable.fnGetNodes());
		//var reviewEventArray = $('input.needReviewEvent');
		var indexOfReviewEvents = getIndexOfTh("reviewEvents");
		$('input.needReviewEvent').each(function(){
			var thisInput = $(this);
			if(!($(this).parent().parent().find("input.alreadyLoad").length>0)&&!$(this).hasClass("pendingReviewEvents")){

				var updateEventRow = oTable.fnGetPosition(this.parentNode.parentNode);
				//this.defaultValue and this.attributes.getNamedItem("value").nodeValue is also right
				var JSonUrl = getPortletUrl();
                JSonUrl = JSonUrl.replace('resourceUrl', "searchReviewEventsByInvoiceUID");
				JSonUrl = JSonUrl.replace('serviceName', "SalesInvoiceManager");
				JSonUrl = JSonUrl.replace('methodValue', "searchReviewEventsByInvoiceUID");
                JSonUrl = JSonUrl.replace('params', "invoiceUID");
				JSonUrl = JSonUrl.replace('paramValue', this.value);
				JSonUrl = JSonUrl.replace('tenantValue', $(this).attr("tenant"));
				if($(this).attr("tenant")=="HPI" &&　$(this).attr("BDOType")=="DDSEnterpriseSalesInvoice"){
					JSonUrl = JSonUrl.replace('bdoTypeValue', "DDSInvoiceUID");
				}else{
					JSonUrl = JSonUrl.replace('bdoTypeValue', "InvoiceUID");
				}

				$(this).removeClass("pendingReviewEvents").addClass("pendingReviewEvents");
				jQuery.getJSON(
					JSonUrl, // portlet resource url
					{},
					function(response) {
						// Handle AJAX Response.
						//You can define your own logic here
						if(response == null){
                            oTable.fnUpdate( "<input type='hidden' class='alreadyLoad'/><span style='color:red;display:inline;'>Unexpected exception</span>", updateEventRow, indexOfReviewEvents,false );
						}else{
							if(!(response.authorized != undefined && response.authorized !="" && response.authorized == "false")) {
								if(response.entity != undefined){
									response = response.entity;
									oTable.fnUpdate( "<input type='hidden' class='alreadyLoad'/>"+response, updateEventRow, indexOfReviewEvents,false );
								}else{
                                    oTable.fnUpdate( "<input type='hidden' class='alreadyLoad'/>", updateEventRow, indexOfReviewEvents,false );
                                }
							}else{
                                oTable.fnUpdate( "<input type='hidden' class='alreadyLoad'/><span style='color:red;display:inline;'>Unexpected exception</span>", updateEventRow, indexOfReviewEvents,false );
                            }
						}
				}).error(function(jqXHR, textStatus, errorThrown) {
					if(textStatus =='timeout'){
							isTimeout = true;
					}else{
				  	 	
					}
					 oTable.fnUpdate( "<input type='hidden' class='alreadyLoad'/><span style='color:red;display:inline;'>Backend service timed out</span>", updateEventRow, indexOfReviewEvents,false );
				}).complete(function(event,xhr,options) {
					thisInput.removeClass("pendingReviewEvents");
					if(!isTimeout){
						isTimeout = false;
						if(event.status == 302 || event.status == 0){
					   		window.location.reload(); 
						}
					}
				});
			}
		});
	};
	function getFilename(elm){
	 	var fn = $(elm).val();
	 	$("#subAttachment").val(fn);
	};
 

       
	$(document).ready(function() {
		//alert(invoiceStatesStr);
		$("#attachment_upload,#subAttachment").val("");
		
   		$(document).on("change","#attachment_upload",function(event){
    		getFilename($(this));
			
			var isCheckFile=$("#attachment_upload,#subAttachment").val()!="";
			if(isCheckFile){
            if(!isValidateFile($("#attachment_upload"))){
                $("#errMsg").empty();
				//Only suffix is 'xls' or 'xlsx' or 'pdf'can be upload
				$("#errMsg").show().css("color","red").append("<p>Only 'xls' or 'xlsx' or 'pdf' suffix can be uploaded! Please choose proper file format.<p>");
				$("#attachment_upload,#subAttachment").val("");
				isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,false);
                return false;
            }}
			
			file_size = this.files[0].size;
            var size = file_size / 1024;
                    if(isCheckFile){
					if (size > 10240) {
                       $("#errMsg").empty();
					   //File size should not larger than 10M
						$("#errMsg").show().css("color","red").append("<p>File size limit is 10MB! Please choose smaller file to upload<p>");
						$("#attachment_upload,#subAttachment").val("");
						isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,false);
						return false;
                    }}
					
			isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,isUploadEnable);
					
			
        });
		
		function isAttButtonDisplay(button,buttonFunc,flag){
			if(flag){
					if(buttonFunc==uploadFunc){
						$("#errMsg").empty();
					}
					button.removeClass('disable'); // Disables visually
					if(buttonFunc==browseFunc){
						button.attr("onclick","$('#attachment_upload').click();");
					}
					else{
						button.unbind().on("click",buttonFunc);
					}
				}
			else{
				if(buttonFunc==browseFunc){
						button.removeAttr("onclick");
					}
					button.addClass('disable'); // Disables visually
					button.unbind();//unbind("click",buttonFunc);
				}
		}
		var browseFunc=function(){
				$('#attachment_upload').click();
			};
		var uploadFunc=function(){
    		$("#errMsg").empty();
			isUploadEnable=false;
			var draftFileName=$("#attachment_upload")[0].value;
			var indes=draftFileName.lastIndexOf("\\");
			var finalUploadFileName=draftFileName.substring(indes+1,draftFileName.length);
			//$("UploadAttachmentFileName").val(finalUploadFileName);
			$("#UploadAttachmentFileName").attr("filename",finalUploadFileName);
			
    		if($("#attachment_upload").val() == ""){
				$("#errMsg").show().css("color","red").append("<p>Choose file to upload!<p>");
				isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,false);
				isUploadEnable=true;
				return false;
    		}
			$("#errMsg").show().css("color","blue").append("<p>File is loading, please wait...<p>");
			
		 	var JSonUrl = getUploadInvoiceAttachmentUrl();
			JSonUrl = JSonUrl.replace('invoiceUIDValue', $("#actionDiv_InvoiceUID").attr("value"));
			//countryvalue only will use when release invoice from Awatting_Attachment.
			//JSonUrl = JSonUrl.replace('countryValue', $("#actionDiv_InvoiceToCountry").attr("value"));
			//Hide upload button after below ajax request been triggered to disable multiple upload.
			isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,false);		
			isAttButtonDisplay($("#browseAttachmentBtn"),browseFunc,false);		
			
			$.ajax({
			url: JSonUrl,
			type: 'POST',
			cache: false,
			data: new FormData($('#uploadAttachmentForm')[0]),
			processData: false,
			contentType: false}).done(function(res) {
				/attachmentID=(\d*)/.test(res);
				var attid =RegExp.$1;
				var test=res;
				 if(attid!="00"){
					$("#errMsg").empty();
					$("#errMsg").show().css("color","green").append("<p>File uploaded! Object_id :"+attid+". You can delete the file if needed, or release the invoice.<p>");
					$("#UploadAttachmentObjectID").val(attid);
					isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,true);
					isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,true);
										
				 }else{
				  $("#errMsg").empty();
					$("#errMsg").show().css("color","red").append("<p>Upload attachment failed, please try again later!<p>");
					isUploadEnable=true;
					isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,isUploadEnable);
				 }
				 
			}).fail(function(res) {
				//alert(res);
				$("#errMsg").empty();
				$("#errMsg").show().css("color","red").append("<p>Upload attachment failed, please try again later!<p>");
				isUploadEnable=true;
				isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,isUploadEnable);
			});
			
			//$("#attachment_upload,#subAttachment").val("");
    		return false;
    	}
    	
    			
		//$("#deleteAttachmentBtn").click();
		var deleteFunc=function(){
    		//Logic to delete attachment from the invoice if upload wrong file.
			$("#errMsg").empty();
			var JSonUrl = getDeleteInvoiceAttachmentUrl();
			
			JSonUrl = JSonUrl.replace('invoiceUIDValue', $("#actionDiv_InvoiceUID").attr("value"));
			JSonUrl = JSonUrl.replace('fileNameValue', $("#UploadAttachmentFileName").attr("filename"));
			JSonUrl = JSonUrl.replace('objectIDValue', $("#UploadAttachmentObjectID").val());
			$("#errMsg").show().css("color","blue").append("<p>Deleting the file, please wait...<p>");
			//Set delete and release button disable
			isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,false);
			isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,false);
			//Send to back end and handle response			
			$.ajax({
			url: JSonUrl,
			type: 'GET',
			cache: false,
			processData: false,
			contentType: false})
			.done(function(res) {
				var ret = $.parseJSON(res);
				if(ret.entity &&ret.entity.indexOf('Deleted') >=0)
				{
					 isUploadEnable=true;
					isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,isUploadEnable);
					isAttButtonDisplay($("#browseAttachmentBtn"),browseFunc,true);
					$("#errMsg").empty();
					 $("#errMsg").show().css("color","green").append("<p>Delete success, you can upload new file now.<p>");
					isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,false);
					isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,false);
				}
				else
				{
					if(ret.entity){
						$("#errMsg").empty();
						$("#errMsg").show().css("color","red").append("<p>Delete attachment file failed, please try again later! Error:"+ret.entity+"<p>");
						isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,true);
						isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,true);
					}
					else
					{
						$("#errMsg").empty();
						$("#errMsg").show().css("color","red").append("<p>Delete attachment file failed, please try again later!<p>");
						isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,true);
						isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,true);
					}
				}
				 
				
				 $("#UploadAttachmentObjectID").val("");
				  $("#UploadAttachmentFileName").attr("filename","");
			}).fail(function(res) {
				//alert(res);
				$("#errMsg").show().css("color","red").append("<p>Delete attachment file failed, please try again later!<p>");
				isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,true);
				isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,true);
			});
			
			//jQuery.getJSON(
			//JSonUrl,
			//{}
			//)
			//.error(function(jqXHR, textStatus, errorThrown) {
			//return false;
			//})
			//.complete(function(event,xhr,options) {
			//return false;
			//});
			
    	};
		//$("#releaseAttachmentBtn").click();
		var releaseFunc=function(){
    		//Logic to release invoice from AWAITING_ATTACHMENTS to TRANSMITTED_TO_EVENDOR status
			$("#errMsg").empty();
			//Set delete and release disabled
			isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,false);
			isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,false);
			var JSonUrl = getReleaseInvoiceUrl();
			
			JSonUrl = JSonUrl.replace('invoiceUIDValue', $("#actionDiv_InvoiceUID").attr("value"));
			JSonUrl = JSonUrl.replace('countryValue', $("#actionDiv_InvoiceToCountry").attr("value"));
			$("#errMsg").show().css("color","blue").append("<p>Releasing the invoice, please wait...<p>");
			
			$.ajax({
			url: JSonUrl,
			type: 'DELETE',
			cache: false,
			timeout:120000,//set timeout 120s
			processData: false,
			contentType: false}).done(function(res) {
				
				var ret = $.parseJSON(res);
				if(ret.entity &&ret.entity.indexOf('Documents successfully') >=0)
				{
					 $("#errMsg").empty();
					 $("#errMsg").show().css("color","green").append("<p>Release Success, you can close the window now!<p>");
					 isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,false);
					 isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,false);
					isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,false);
					//$('#state').val("AWAITING_ATTACHMENT");
					//$("[id='state'] + div > span.selecter-selected").attr("title","AWAITING_ATTACHMENT").html("AWAITING_ATTACHMENT");
					//DocumentForm.search();
					setTimeout(DocumentForm.search,8000);
				}
				else
				{
					if(ret.entity){
						$("#errMsg").show().css("color","red").append("<p>Release failed, please try again later! Error:"+ret.entity+"<p>");
						isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,true);
					isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,true);
					}else if(ret.message){
						$("#errMsg").empty();
						$("#errMsg").show().css("color","red").append("<p>"+ret.message+". Please contact support team for help.<p>");
						isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,true);
					isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,true);
					}
					else
					{
						$("#errMsg").empty();
						$("#errMsg").show().css("color","red").append("<p>Release failed, backend service error,please try again later or contact support team for help.<p>");
						isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,true);
					isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,true);
					}
				}
				 
				
			}).error(function(XMLHttpRequest, status){
				if(status){
					if(status=='timeout'){
						$("#errMsg").empty();
					 $("#errMsg").show().css("color","red").append("<p>Release failed, backend service timeout,please try again later or contact support team for help.<p>");
					 isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,true);
					isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,true);
					}
					
				}
			})
			;
			
			//jQuery.getJSON(
			//
			//)
			//.error(function(jqXHR, textStatus, errorThrown) {
			//return false;
			//})
			//.complete(function(event,xhr,options) {
			//return false;
			//});
			
    	};
		
		$("#state").append("<option value=''>All</option>");
		var invoiceStateString = eval(invoiceStatesStr);
		//var stateString;
		for(i=0;i<invoiceStateString.length;i++){
		//alert(invoiceStateString[i].paramValue);
			//stateString += invoiceStateString[i].paramValue+",";
			$("#state").append("<option value="+invoiceStateString[i].paramValue+">"+invoiceStateString[i].paramDisplayName+"</option>");
		};
		//stateString = stateString.substring(0,stateString.lastIndexOf(","));
		//stateString = stateString.replace("undefined","");
		//alert(stateString);
		//$("#state").prepend("<option selected='selected' value="+stateString+">All</option>");
		//alert(stateString);
        var historyWidth = wWidth * 0.90;
        var wHeight = $(window).height();
        var historyHeight = wHeight * 0.8;
        
        
		$("section:last-child").css(
			{"border-bottom-width": 1,
				"border-bottom-color": '#CCCCCC',
				"border-bottom-style": 'solid'}
		)  


		$("i.icon-minus-sign-alt").bind('click', function(){
			if($(this).prop('class') == 'icon-minus-sign-alt'){
				$(this).removeClass('icon-minus-sign-alt').addClass('icon-plus-sign-2');
				$("#searchContent").hide();
				// $(".controllerButtons").hide();
				return false;
			}else{
				$(this).removeClass('icon-plus-sign-2').addClass('icon-minus-sign-alt');
				$("#searchContent").show();
				// $(".controllerButtons").show();
				return false;
			}
		});
	

	// $('.accordion h2')[0].click();
	//enter,tab
	$(function(){
		document.onkeydown = function(e){ 
    	var ev = document.all ? window.event : e;
    	if(ev.keyCode==13) {
				$("#searchBtn").click();
     	}   	
			
		}
		
	}); 
	
	

		// viewAuthority = checkIfOperationAuthorizedForCurrentUser("VIEW_INVOICE",null);
		// downloadAuthority = checkIfOperationAuthorizedForCurrentUser("DOWNLOAD_INVOICE",null);	
		// historyAuthority = checkIfOperationAuthorizedForCurrentUser("VIEW_INVOICE_HISTORY",null);
		// duplicateCheckAuthority = checkIfOperationAuthorizedForCurrentUser("BYPASS_DUPLICATE_CHECK",null);
		// reprocessAuthority = checkIfOperationAuthorizedForCurrentUser("REPROCESS",null);		
		// cancelAuthority = checkIfOperationAuthorizedForCurrentUser("CACEL",null);
		var eventX=0,eventY=0;	
		
		if(navigator.appVersion.indexOf("MSIE 8.")!=-1){
                
			$('.btn').corner("tr bl 5px");
		 }
		
		if(cancelAuthority){
			$("<input type='button' class='cancelInvoice' id='cancelAllBtn' value='"+$("#cancelAction").val()+"'/>").prependTo($("#menuTools_Div"));
		}
		if(reprocessAuthority) {
			$("<input type='button' class='reprocessInvoice' id='reprocessAllBtn' value='"+$("#reprocessIconTitle").val()+"'/>").prependTo($("#menuTools_Div"));
		}
		
		
		//<div class="menuTools_buttons" id="exportCSVButton" style="display:none;" title="<fmt:message key="exportCSVTitle" bundle="${bundle}"></fmt:message>"><img src="/resource3/qtca/<%=PropertiesUtil.getCurrentResourceVersion()%>/images/export-csv.png" class="image"/><fmt:message key="exportCSVButton" bundle="${bundle}"></fmt:message></div>
		$("#exportCSVButton").hide();
		$("#reprocessAllBtn").hide();
		$("#filterIcon").hide();
		$("#cancelAllBtn").hide();	
		
		$("#showReprocessMesg").dialog({
			show: null,
			autoOpen: false,
			width: 640,
			height: 300,
			draggable: true,                
			resizable: false,
			modal: true
		})
			
		//initial popup dialog
		$("#invoicePopupDiv").dialog({
			show: null,
			resizable: true,
			autoOpen: false,
			width: 640,
			height: 300,
			draggable: true,                
			resizable: true,
			modal: true
		});
		$("#uploadPopupDiv").dialog({
			show: null,
			resizable: true,
			autoOpen: false,
			width: 640,
			height: 300,
			draggable: true,                
			resizable: true,
			modal: true
		});
		$("#copyInvoiceDiv").dialog({
			show: null,
			resizable: true,
			autoOpen: false,
			width: 360,
			height: 250,
			draggable: true,                
			resizable: true
			
		});
		
		$("#invoiceHistoryPopupDiv").dialog({
			show: null,
			autoOpen: false,
			width: historyWidth,
			height: 630,
			draggable: true,                
			resizable: false,
			modal: true
		});
		
		$("#checkPassDuplicateInvoiceDiv").dialog({
			show: null,
			resizable: true,
			autoOpen: false,
			width: 550,
			height: 260,
			draggable: true,                
			resizable: true,
			modal: true
		});
		$("#uploadDialog").dialog({
			height: 250,//Customizable
			width: 600,//Customizable
			modal: true,
			autoOpen: false
			}); 
    	$("#reprocessBtn").click(function(){

    	});
      function isValidateFile(obj) {
        var extend = obj[0].value.substring(obj[0].value.lastIndexOf(".") + 1);
        extend=extend.toLowerCase();
        //console.log(extend);
        if (extend == "") {
            return false;
        } 
        else {
            if (!(extend == "xls" || extend == "xlsx"||extend == "pdf")) {
                return false;
            }
        }
        return true;
    	}
		/*
		$("#actionDiv").dialog({
			show: null,
			//resizable: true,
			autoOpen: false,
			width: 200,
			height: 75
		});*/
		
		//dialog-confirm-reprocess let user confirm to reprocess the selected invoice or not
		var buttonSure=$("#sureAction").val();
		var buttonCancel=$("#cancelAction").val();
		var l10nButtons = {};
		var cancelButtons = {};
		// l10nButtons[buttonSure] = function() { 
		// 	$("#dialog-confirm-reprocess").dialog("close");
		// 	var uniqueIndentifyId = reprocessUid;
		// 	var reprocessInvoiceUIDList = new Array();
		// 	reprocessInvoiceUIDList.push(uniqueIndentifyId);
		// 	batchReprocessInvoice(reprocessInvoiceUIDList);
		// };
		 // l10nButtons[buttonCancel] = function() { $(this).dialog('close'); };
		
		// cancelButtons[buttonSure] = function() { 
		// 	$("#dialog-confirm-cancel").dialog("close");
		// 	var canceledInvoiceUID = cancelInvoiceUID;
		// 	var cancelInvoiceUIDList = new Array();
		// 	cancelInvoiceUIDList.push(canceledInvoiceUID);
		// 	batchCancelInvoice(cancelInvoiceUIDList);
		// };
		// cancelButtons[buttonCancel] = function() { $(this).dialog('close'); };
		$("#dialog-confirm-reprocess").dialog({
       		resizable: false,
			width: 380,
			autoOpen: false,
            modal: true,
            buttons: [
            { text: 'Go', click: function() {},'class':'sureButton btn-Primary reprocessGoBtn'}
            	, {text: buttonCancel, click: function() {$("#dialog-confirm-reprocess").dialog("close"); },'class':'cancelButton' }
			] 
    	});
    
    	$("#dialog-confirm-reprocess-two").dialog({
				resizable: false,
				width: 380, //Customizable
				autoOpen: false,
				modal: true,
				buttons: //Customizable
				[ {
						text: "Yes", //Your button name
						"class":"sureButton btn-Primary", //Button class synchronized with' Button' page which is used to define color(such as btn-Primary,btn-Primary )
						click: function() {
							$("#dialog-confirm-reprocess-two").dialog("close");
          					preTobatchReprocessInvoice();
						}
					},
					{
						text: "Cancel", //Your Button Name
						"class":"cancelButton btn-Primary", //Button class synchronized with 'Button 'page which is used to define color(such as btn-Primary,btn-Primary )
						click: function() {
							
							$(this).dialog( "close" );
							$("#dialog-confirm-reprocess").dialog( "open" );
						} } ]
		});
		
		$(".reprocessGoBtn").click(function() {
				$("#dialog-confirm-reprocess").dialog("close");
            		reprocessAs = $('input[name="rr"]:checked').val();
            		if(reprocessAs =='original'){
            			$('#original').css('display','inline-block');
            			$('#copy').css('display','none');
            			$("#dialog-confirm-reprocess-two").dialog("open");
            		}else{
            				preTobatchReprocessInvoice();
            		}
            		
            		
            
		});
		
		$("#dialog-confirm-cancel").dialog({
            resizable: false,
			width: 350,
//            height:150,
			autoOpen: false,
            modal: true,
            buttons: [
            	{ text: buttonSure, click: function() {
            		$("#dialog-confirm-cancel").dialog("close");
            		if( cancelInvoiceUID !=''){
						var canceledInvoiceUID = cancelInvoiceUID;
						var canceledInvoiceTenant = cancelInvoiceTenant||"HPQ";
						var cancelInvoiceUIDList = {};
						cancelInvoiceUIDList[canceledInvoiceUID] = canceledInvoiceTenant;
						batchCancelInvoice(cancelInvoiceUIDList); 
					}else{
						batchCancelInvoice(batchCancelInvoiceIds); 
						}
					},'class':'sureButton btn-Primary'
				}, 

				{text: buttonCancel, click: function() {$("#dialog-confirm-cancel").dialog("close");
					 },'class':'cancelButton' 

				}
			] 
        });

    $(".sureButton").prepend("<i class='icon-ok' style='margin-left: 15px; margin-top: 8px;'></i>");
	$(".cancelButton").prepend("<i class='icon-ban-circle' style='margin-left: 15px; margin-top: 8px;'></i>");

		if(navigator.appVersion.indexOf("MSIE 8.")!=-1){
			$(".sureButton").corner("tr bl 5px");
			$(".cancelButton").corner("tr bl 5px");
		}

		$("#invoicePopupDiv").bind("click", function(event){
			event.stopPropagation();
		});	
		
		//add datatimepicker for data,which will contains the time
	
		var dateObj = {
	        changeMonth: true,
	        changeYear:true,
	        maxDate:1,
	        minDate:-400

	    };
	    var currentStatus = "";
	    var dateStart = dateObj;
	    var startDateTextBox = $('#fromDate');

    	$.extend(dateStart,
            {
            	onClose: function(dateText, inst) {
                if (endDateTextBox.val() != '') {
                    var testStartDate = startDateTextBox.datetimepicker('getDate');
                    var testEndDate = endDateTextBox.datetimepicker('getDate');

                    if (testStartDate > testEndDate){

                        endDateTextBox.datetimepicker('setDate', testStartDate);
                    }
              
                };
                // else {
                //     endDateTextBox.val(dateText);
                // };
                if(this.value==''){
                	endDateTextBox.datetimepicker("option","minDate", -400);
                }
                else{
                    endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
                }

                currentStatus = "from";
            }, 
               onChangeMonthYear: function (year, month, dp_inst) {
                startDateTextBox.datetimepicker('setDate', (new Date(startDateTextBox.val())) );
                // endDateTextBox.datetimepicker('option', 'minDate', (new Date(startDateTextBox.val())) );

            },
                onSelect: function (selectedDateTime){

                endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
                currentStatus = "from";

                }
            });

    startDateTextBox.datetimepicker(dateStart);

    var dateEnd = dateObj;
    var endDateTextBox = $('#toDate');
    $.extend(dateEnd,
            {
            	onClose: function(dateText, inst) {
                if (startDateTextBox.val() != '') {
                    var testStartDate = startDateTextBox.datetimepicker('getDate');
                    var testEndDate = endDateTextBox.datetimepicker('getDate');
                    if (testStartDate > testEndDate){
                        startDateTextBox.datetimepicker('setDate', testEndDate);
                    }
                  
                };
                // else {
                //     startDateTextBox.val(dateText);
                // };
                if(this.value==''){
                	
                	startDateTextBox.datetimepicker('setDate', testStartDate);
                	startDateTextBox.datetimepicker("option","maxDate", 1);

                }
                else{
                    startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
                }
                currentStatus = "to";
            }, 

            	onChangeMonthYear: function (year, month, dp_inst) {
                endDateTextBox.datetimepicker('setDate', (new Date(endDateTextBox.val())) );
                // startDateTextBox.datetimepicker('option', 'maxDate', (new Date(endDateTextBox.val())) );
            },
                onSelect: function (selectedDateTime){
                    startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
                    currentStatus = "to";
                }
                //showSecond: true,
             
            });
    endDateTextBox.datetimepicker(dateEnd);

    var TdateObj = {
        changeMonth: true,
        changeYear:true,
        maxDate:1,
        minDate:-400

    };
    var TcurrentStatus = "";
    var TdateStart = TdateObj;
    var TstartDateTextBox = $('#transmissionFromDate');
    // var datess = TstartDateTextBox.datetimepicker('getDate');
    // var gethour=datess.getHours();

    $.extend(TdateStart,
            {
            	onClose: function(dateText, inst) {
                if (TendDateTextBox.val() != '') {
                    var TtestStartDate = TstartDateTextBox.datetimepicker('getDate');
                    var TtestEndDate = TendDateTextBox.datetimepicker('getDate');
                    if (TtestStartDate > TtestEndDate)
                        TendDateTextBox.datetimepicker('setDate', TtestStartDate);
                };
                // else {
                //     TendDateTextBox.val(dateText);
                // }
                 if(this.value==''){
                	TendDateTextBox.datetimepicker("option","minDate", -400);
                }
                 else{
                    TendDateTextBox.datetimepicker('option', 'minDate', TstartDateTextBox.datetimepicker('getDate') );
                }
                TcurrentStatus = "from";
            }, 
            	onChangeMonthYear: function (year, month, dp_inst) {
                TstartDateTextBox.datetimepicker('setDate', (new Date(TstartDateTextBox.val())) );
                // TendDateTextBox.datetimepicker('option', 'minDate', (new Date(TstartDateTextBox.val())) );
            },
                onSelect: function (selectedDateTime){

                    TendDateTextBox.datetimepicker('option', 'minDate', TstartDateTextBox.datetimepicker('getDate') );
                    TcurrentStatus = "from";
                }
            });

    TstartDateTextBox.datetimepicker(TdateStart);

    var TdateEnd = TdateObj;
    var TendDateTextBox = $('#transmissionTODate');
    $.extend(TdateEnd,
            {onClose: function(dateText, inst) {
                if (TstartDateTextBox.val() != '') {
                    var TtestStartDate = TstartDateTextBox.datetimepicker('getDate');
                    var TtestEndDate = TendDateTextBox.datetimepicker('getDate');
                    if (TtestStartDate > TtestEndDate)
                        TstartDateTextBox.datetimepicker('setDate', TtestEndDate);
                };
                // else {
                //     TstartDateTextBox.val(dateText);
                // }
                if(this.value==''){
                	TstartDateTextBox.datetimepicker("option","maxDate", 1);
                	TstartDateTextBox.datetimepicker('setDate', TtestStartDate );
                }
                else{
                    TstartDateTextBox.datetimepicker('option', 'maxDate', TendDateTextBox.datetimepicker('getDate') );
                };
                TcurrentStatus = "to";
            }, 
            onChangeMonthYear: function (year, month, dp_inst) {
                TendDateTextBox.datetimepicker('setDate', (new Date(TendDateTextBox.val())) );
                // TstartDateTextBox.datetimepicker('option', 'maxDate', (new Date(TendDateTextBox.val())) );
            },
            onSelect: function (selectedDateTime){
                    TstartDateTextBox.datetimepicker('option', 'maxDate', TendDateTextBox.datetimepicker('getDate') );
                    TcurrentStatus = "to";
                }
                //showSecond: true,
             
            });
    TendDateTextBox.datetimepicker(TdateEnd);




    var RdateObj = {
	        changeMonth: true,
	        changeYear:true,
	        maxDate:1,
	        minDate:-400

	};
    var RcurrentStatus = "";
    var RdateStart = RdateObj;
    var RstartDateTextBox = $('#ReceiveFromDate');

	$.extend(RdateStart,
            {
            	onClose: function(dateText, inst) {
                if (RendDateTextBox.val() != '') {
                    var testStartDate = RstartDateTextBox.datetimepicker('getDate');
                    var testEndDate = RendDateTextBox.datetimepicker('getDate');

                    if (testStartDate > testEndDate){

                        RendDateTextBox.datetimepicker('setDate', testStartDate);
                    }
              
                };
                // else {
                //     RendDateTextBox.val(dateText);
                // };
                if(this.value==''){
                	RendDateTextBox.datetimepicker("option","minDate", -400);
                }
                else{
                    RendDateTextBox.datetimepicker('option', 'minDate', RstartDateTextBox.datetimepicker('getDate') );
                }

                currentStatus = "from";
            }, 
               onChangeMonthYear: function (year, month, dp_inst) {
                RstartDateTextBox.datetimepicker('setDate', (new Date(RstartDateTextBox.val())) );
                // RendDateTextBox.datetimepicker('option', 'minDate', (new Date(startDateTextBox.val())) );

            },
                onSelect: function (selectedDateTime){

                RendDateTextBox.datetimepicker('option', 'minDate', RstartDateTextBox.datetimepicker('getDate') );
                currentStatus = "from";

                }
            });


    RstartDateTextBox.datetimepicker(RdateStart);

    var RdateEnd = RdateObj;
    var RendDateTextBox = $('#ReceiveToDate');
    $.extend(RdateEnd,
            {
            	onClose: function(dateText, inst) {
                if (RstartDateTextBox.val() != '') {
                    var testStartDate = RstartDateTextBox.datetimepicker('getDate');
                    var testEndDate = RendDateTextBox.datetimepicker('getDate');
                    if (testStartDate > testEndDate){
                        RstartDateTextBox.datetimepicker('setDate', testEndDate);
                    }
                  
                };
                // else {
                //     RstartDateTextBox.val(dateText);
                // };
                if(this.value==''){
                	
                	RstartDateTextBox.datetimepicker('setDate', testStartDate);
                	RstartDateTextBox.datetimepicker("option","maxDate", 1);

                }
                else{
                    RstartDateTextBox.datetimepicker('option', 'maxDate', RendDateTextBox.datetimepicker('getDate') );
                }
                currentStatus = "to";
            }, 

            	onChangeMonthYear: function (year, month, dp_inst) {
                RendDateTextBox.datetimepicker('setDate', (new Date(RendDateTextBox.val())) );
                // RstartDateTextBox.datetimepicker('option', 'maxDate', (new Date(RendDateTextBox.val())) );
            },
                onSelect: function (selectedDateTime){
                    RstartDateTextBox.datetimepicker('option', 'maxDate', RendDateTextBox.datetimepicker('getDate') );
                    currentStatus = "to";
                }
                //showSecond: true,
             
            });
	    RendDateTextBox.datetimepicker(RdateEnd);




		//submit form to search invoice
		$("#form").submit(function () {
			//changeable=false;
			
			DocumentForm.search();
			return false;
		});

		
		$("#searchBtn").click(function(){								 
			submitfunc();
			// $(".SearchClose").css({"background-position":"left -1950px"});
			// $("#searchContent").slideUp("slow");
		});
	
		$("#resetFilters").click(function(){
			
			resetSelecterPlugin('state');	
			resetSelecterPlugin('businessOperSlct');
			resetSelecterPlugin('incoiveTypeSlct');
			resetSelecterNoDefPlugin('invtocountrycd');
			resetSelecterNoDefPlugin('soldtocountrycd');
			resetSelecterNoDefPlugin('shiptocountrycd');
			document.getElementById('form').reset();
	
			$('#toDate,#transmissionTODate,#transmissionFromDate,#fromDate,#ReceiveFromDate,#ReceiveToDate').datetimepicker('setTime', (new Date("05/28/2013 00:00")) );
			
    		$("#fromDate").datetimepicker("option","maxDate", 1).prop('value','');
    		$("#transmissionFromDate").datetimepicker("option","maxDate", 1).prop('value','');
    		$("#ReceiveFromDate").datetimepicker("option","maxDate", 1).prop('value','');
    		$('#toDate').datetimepicker('option',{minDate: -400}).prop('value','');
    		$("#transmissionTODate").datetimepicker('option',{minDate: -400}).prop('value','');
    		$("#ReceiveToDate").datetimepicker('option',{minDate: -400}).prop('value','');

		});
		//get select list from properties file		
		var businessOperationModelArray = eval('(' + businessOperationModelStr + ')');
		businessOperationModelArray.sort(function(a,b){
			return a.paramDisplayName > b.paramDisplayName ?1:-1;
		});
		for(var i=0; i<businessOperationModelArray.length;i++){
        	if(businessOperationModelArray[i].children.length>0 && businessOperationModelArray[i].children != null){
        		businessOperationModelArray[i].children.sort(function(a,b){
					return a.paramDisplayName > b.paramDisplayName ?1:-1;
				});			
        	}
        }
        // var bomStringArray = eval('(' + businessOperationModelStr + ')');
        // businessOperationModelArray.push("All");
        // bomStringArray.push("All");
        // for(var i=0; i<bomStringArray.length;i++){
        // 	if(typeof bomStringArray[i] == "object" || bomStringArray[i] === null){
        // 		bomStringArray[i] = Object.keys(bomStringArray[i])[0];			
        // 	}
        // }
        // bomStringArray = bomStringArray.sort();
        // for (var i = 0;i < bomStringArray.length ;  i++) {
        // 	for(var j = 0;j < businessOperationModelArray.length ;  j++){
        // 		if(typeof businessOperationModelArray[j] == "object" || businessOperationModelArray[j] === null){
        // 			if(Object.keys(businessOperationModelArray[j])[0]== bomStringArray[i]){
        // 				var groupName = Object.keys(businessOperationModelArray[j])[0];
        // 				businessOperationModelArray[j][groupName] = businessOperationModelArray[j][groupName].sort();
        // 				bomStringArray[i] = businessOperationModelArray[j];
        // 			}
        // 		}
        // 	}
        	
        // }
		var incoiveTypeArray=incoiveTypeStr.split(";");
		generateBomOption("businessOperSlct",businessOperationModelArray,"All");
		generateSelectOptionwithID("incoiveTypeSlct",incoiveTypeArray,"All");
		
		generateSelectOptionwithjson("countrySlct",codeOrder,""); 
		generateSelectOptionwithjson("soldtocountrySlct",codeOrder,"");
		generateSelectOptionwithjson("shiptocountrySlct",codeOrder,"");
		$("#businessOperSlct option[value='All']").prop("value",businessOperationModelStr);
		$("#incoiveTypeSlct option[value='All']").prop("value","");

		//export the datafile to csv,it will export all the records in the datatable, include the hide and invisible record.
		$("#exportCSVButton").click(function(){
			if(oTable == undefined || oTable.fnSettings().fnRecordsTotal()<=0){
				var messageDiv = document.getElementById("displayMessage");
				messageDiv.style.color="red";
				$("#displayMessage").html($("#noRecordToExport").val());
			}else{
				var csvResults = table2csv(oTable,'full','search_result');
				$("#csvContents").val(csvResults);
				//for chrome 43 version and above,enctype "application/x-www-form-urlencoded" will cause export issue
				$("#exportCSVForm").attr("enctype","multipart/form-data");
				//if require to overwrite the action url, then can use below comment
				//$("#exportCSVForm").attr("action", $("#contentPath").val()+"/exportCsv.jsp");	
				$("#exportCSVForm").submit();
			}
		});
		$("#uploadBtn").click(function(){
			$( "#uploadDialog" ).dialog( "open" );
		});
		//comments as no need this url
		// if (!isSupperUser) {
		// 	$("#applyAdminDiv").empty();
		// 	$("#applyAdminDiv").append("<a href='"+adminurl+"' id='applyAdminBtn' target='_blank'>"+$("#applyAdmin").val()+"</a>");
		// 	$("#applyAdminDiv").show();
		// };

		/*$("#applyAdminBtn").click(function(){
			var messageDiv = document.getElementById("displayMessage");
			var applyUrl = applyAdminEmail();		
			onStart();
			jQuery.getJSON(
				applyUrl, 
				{},
				function(response) {			
					if(response.entity=="successful") {	
						messageDiv.style.color="green";			
						$("#displayMessage").html("Apply admin email has send out successfully");
						$("#applyAdminBtn").hide();
						//$("#applyAdminBtn").css("color","grey");
						//$("#applyAdminBtn").attr("disabled","true");
					}
					else{	
						messageDiv.style.color="red";
						$("#displayMessage").html("Send apply email failed");
					}
			}).error(function(jqXHR, textStatus, errorThrown) {
				if(textStatus =='timeout'){
					messageDiv.style.color="red";
					$("#displayMessage").html(requestTimeOutMeg.replace("{0}","apply admin"));
				}else{
					document.getElementById("displayMessage").style.color="red";
				$("#displayMessage").html("Data service is not available. No data returned");
				}
			});
			return false;
		});*/
		
		/* Custom filtering function which will filter data by selected state in history dialog */
		$.fn.dataTableExt.afnFiltering.push(
			function( oSettings, aData, iDataIndex ) {
				if(oSettings.nTable != $("#viewHistory_result")[0]){
					return true;
				}
				var selectedStateList = $("select.historyStateDropdown").val();
				if(selectedStateList == undefined || selectedStateList == ""){
					return false;
				}
				if($.inArray(aData[1],selectedStateList) === -1){
					return false;
				}else{
					return true;
				}
				return false;
			}
		);
		
		jQuery.extend( jQuery.fn.dataTableExt.oSort, {
			"num-html-pre": function ( a ) {
				var x = String(a).replace( /<[\s\S]*?>/g, "" );
				return parseFloat( x );
			},
		 
			"num-html-asc": function ( a, b ) {
				return ((a < b) ? -1 : ((a > b) ? 1 : 0));
			},
		 
			"num-html-desc": function ( a, b ) {
				return ((a < b) ? 1 : ((a > b) ? -1 : 0));
			}
		} );
		
		//bind change event for select dropdown in history dialog 
		$("select.historyStateDropdown").css("cursor", "pointer")
		$(document).on("change","select.historyStateDropdown",function(event){
		// $("select.historyStateDropdown").css("cursor", "pointer").live("change",function(event){
			historyOTable.fnDraw();
		});
	
		//when click outer the action div,then close it
		$("body").click(function(){
		  $("#actionDiv").css("display", "none");
		});
		$('#actionDiv').click(function(){
		  return true;
		});
		/*
		$("body").click(function(){
			if($("#actionDiv").hasClass("hover")){
				return true;
			}else{
				$("#actionDiv").css("display", "none");
			}
		});
		
		$("#actionDiv, div.ui-dialog").hover(function(){
			$("#actionDiv").addClass("hover"); 
		},function(){ 
			$("#actionDiv").removeClass("hover");
		}); */
		
		//bind change event for select dropdown in history dialog
		$("div.actionStatus,div.actionLabel,div.actionIcon").css("cursor", "pointer"); 
		$(document).on("click","div.actionStatus,div.actionLabel,div.actionIcon",function(event){

		//$("div.actionStatus,div.actionLabel,div.actionIcon").css("cursor", "pointer").live("click",function(event){
			//alert($(this).attr("value"));
			
			event.stopPropagation();
			var e=event?event:window.event;
			t=e.target||e.srcElement;
			var x= event.clientX+$(this).scrollLeft()-10;
			var y= event.clientY+$(this).scrollTop()+10;
			var indexYY = getPointerY(event)-20;
			getEventPosition(event);
			$("#actionDiv_InvoiceUID").attr("value","");
			$("#actionDiv_InvoiceToCountry").attr("value","");
			$("#actionDiv_actionList").empty();
			$("#actionDiv_InvoiceUID").attr("value",$(this).attr("value"));
			$("#actionDiv_InvoiceToCountry").attr("value",$(this).attr("country"));
			$("#actionDiv_InvoiceUID").attr("tenant",$(this).attr("tenant"));
			$("#actionDiv_InvoiceUID").attr("BDOType",$(this).attr("BDOType"));
			$("#actionDiv_InvoiceUID").attr("docType",$(this).attr("docType"));
			var isUploadVisible=($(this).attr("uploadInvoiceState")==="AWAITING_ATTACHMENT");
			
			$("#actionDiv_actionList").append(gloableActionString);
			if(isUploadVisible){
			$("#actionDiv_actionList").append(uploadActionString);
			}
						
			if($(this).attr("tenant")=="HPI" && $(this).attr("BDOType")=="DDSEnterpriseSalesInvoice"){
				//$("#actionDiv_actionList").children(".cancel").css("display","none");
				$("#actionDiv_actionList").children(".copy").css("display","none");
			}else{
				//$("#actionDiv_actionList").children(".cancel").css("display","block");
				$("#actionDiv_actionList").children(".copy").css("display","block");
			}
			
			
			//$("#actionDiv").dialog("option", "position", [x, y]); 130 440 124 356
			//$("#actionDiv").dialog("open");
			
			/*$("#actionDiv").css("position", "absolute");
			$("#actionDiv").css("left", "20");
			$("#actionDiv").css("top", "20");*/
			//alert("x:"+x+" y:"+indexYY);
			$("#actionDiv").css("display","block");
			$("#actionDiv").css({position: "absolute", left: x, top: indexYY});
			
			//actionDiv

			if(navigator.appVersion.indexOf("MSIE 8.")!=-1){
				
				$("div.downloadInvoice").corner("10px");
				$("div.viewHistory").corner("10px");
				$("div.checkDuplicate").corner("10px");
				$("div.reprocess").corner("10px");
				$("div.cancel").corner("12px");
				$("div.copy").corner("10px");

			}
			
		});
		//view&download invoice click event,it will open a dialog then invoice can be displayed in browser or download to client.
		$(".downloadInvoice").css("cursor", "pointer");
		//copy invoice
		$(document).on("click",".copy",function(event){
			getEventPosition(event);
			copyInvoiceUID = $("#actionDiv_InvoiceUID").val();
			$("#copyToTargetSelect").html("");
			var tmpSelectEnv = "";
			if ("PROD" == currentEnv) {	
				tmpSelectEnv = '<select id="select-environment" name="orgSelect" class="orgSelect">'
									+ '<option value="DEV">DEV</option>'
									+ '<option value="FT">FT</option>'
									+ '<option value="ITG" selected="selected">ITG</option>'	
							 + '</select>';
				
			} else if ("ITG" == currentEnv) {
				tmpSelectEnv = '<select id="select-environment" name="orgSelect" class="orgSelect">'
									+ '<option value="DEV">DEV</option>'
									+ '<option value="FT" selected="selected">FT</option>'
							 + '</select>';
				
			} else if ("FT" == currentEnv) {
				tmpSelectEnv = '<select id="select-environment" name="orgSelect" class="orgSelect">'
									+ '<option value="DEV">DEV</option>'
									+ '<option value="ITG" selected="selected">ITG</option>'										
							 + '</select>';
			} else if ("DEV" == currentEnv) {
				tmpSelectEnv = '<select id="select-environment" name="orgSelect" class="orgSelect">'
									//+ '<option value="DEV" selected="selected">DEV</option>'
									+ '<option value="FT">FT</option>'
									+ '<option value="ITG" selected="selected">ITG</option>'	
							 + '</select>';
			}
			
			$("#copyToTargetSelect").html(tmpSelectEnv);
			$("#copyInvoiceDiv").dialog("close");
			$("#copyInvoiceDiv").dialog("option", "position", [eventX, eventY]);
			$("#copyInvoiceDiv").dialog("open");
			$("#select-environment").selecter({}); 
			
		});
		
		$(document).on("click","a.btn-no",function(event){
			$("#copyInvoiceDiv").dialog("close");
			return false;
		});
			
		$(document).on("click","a.copyInvoiceBtn",function(event){
			$("#displayMessage").html("");
			$("#copyInvoiceDiv").dialog("close");
			copyToEnv = $("#select-environment").val();
			
			if(copyInvoiceUID != null && copyInvoiceUID != ''){
				var copyInvoiceUIDArray = [];
				copyInvoiceUIDArray.push(copyInvoiceUID);
				
				var copyEnvArray = [];
				copyEnvArray.push(copyToEnv);
				
				doCopyInvoice(copyInvoiceUIDArray,copyEnvArray);
			} else {
				var environmentArray = [];
				for (index in batchCopyInvoiceIds) {
					environmentArray.push(copyToEnv);
				}
				doCopyInvoice(batchCopyInvoiceIds,environmentArray);
			}
			
			return false;
		});
		
		function doCopyInvoice(copyInvoiceIds,targetEnvArray) {
			var JSonUrl = getCopyInvoiceUrl();
			JSonUrl = JSonUrl.replace('invoiceUIDValue',$.toJSON(copyInvoiceIds));
			JSonUrl = JSonUrl.replace('environmentValue',$.toJSON(targetEnvArray));
			JSonUrl = JSonUrl.replace('isCopyValue',"true");
			JSonUrl = JSonUrl.replace('operatorValue',$("#sessionUserEmail").attr("value"));
		//	JSonUrl = JSonUrl.replace('operatorValue',"ksong@hp.com");
			var messageDiv = document.getElementById("displayMessage");
			
			onStart();
		$.ajax({
			type:'post',
			url:JSonUrl,
			dataType: 'json',
			timeout:str2Int(ajaxTimePeriodBatch,125000),
			success: function(response){ 
				var succFlag =0 ;
				var failFlag =0;
				batchCopyUIDsList= new Array();
	 			returnStatusList= new Array();
				batchCopyUIDs = '';
				returnStatus = '';

				if(response == null){
					
					alertMessagePop ("displayMessage","Error","No response returned. Copying invoice failed.");
				}else{
					if(response.authorized != undefined && response.authorized !="" && response.authorized == "false") {
						alertMessagePop ("displayMessage","Error","You have no permission to copy invoice.");
					}else{
						if(response.entity != undefined && response.entity != "" && response.entity!= null){
							response = eval(response.entity);							
							for (var i = 0; i < response.length; i++){
								returnStatus += response[i].status;
								if (!(returnStatus.indexOf("200") >= 0 || returnStatus.indexOf("Success")>=0)){
									failFlag ++;
									batchCopyUIDsList.push(response[i].invoiceUID);
									returnStatusList.push( response[i].status);
								}else{
									succFlag ++;
									batchCopyUIDsList.push(response[i].invoiceUID);
									returnStatusList.push( response[i].status);
								}
							}
							
							messageDiv.style.color="green";
							var displayMeg ="";
							if (succFlag == 0 && failFlag !=0 ){
								alertMessagePopNotDisMeg ("displayMessage","Error","Selected invoices copy failed.","<a id='showAllMeg_copy'  href='#'>Please click here to view result.</a>");				
							}
							 if(succFlag != 0 && failFlag !=0 ){
								alertMessagePopNotDisMeg ("displayMessage","Error","Selected invoices copy partially succeeded.","<a id='showAllMeg_copy'  href='#'>Please click here to view result.</a>");	
							}
							if(succFlag != 0 && failFlag ==0 ){
								alertMessagePopNotDisMeg ("displayMessage","Success","Selected invoices copy succeeded.","<a id='showAllMeg_copy'   href='#'>Please click here to view result.</a>");
							}

						}else{
							alertMessagePop ("displayMessage","Error",response.message);
						}
					}
				}
			},
			error:function(jqXHR, textStatus, errorThrown) { 
				
				if(textStatus =='timeout'){
					alertMessagePop ("displayMessage","Error",requestTimeOutMeg.replace("{0}","copy invoice"));
					isTimeout = true;
					return false;
				}else{
					alertMessagePop ("displayMessage","Error","Data service is not available. No data returned");
				}
			
			},
			complete:function(event,xhr,options) {
				if(!isTimeout){
					isTimeout = false;
					if(event.status == 302 || event.status == 0){
			   			window.location.reload(); 
					}
				}
			}
		});
		
		} 
		
		$(document).on("click",".upload",function(event){
			$("#errMsg").empty();
			$("#UploadAttachmentObjectID").val("");
			$("#UploadAttachmentFileName").attr("filename","");
			$("#uploadAttachmentForm")[0].reset();
			isUploadEnable=true;
			var JSonUrl = getPortletUrl();
			JSonUrl = JSonUrl.replace('serviceName', "SalesInvoiceManager");
            JSonUrl = JSonUrl.replace('resourceUrl', "searchInvoiceRevisionsByInvoiceUID");
			JSonUrl = JSonUrl.replace('methodValue', "searchInvoiceRevisionsByInvoiceUID");
            JSonUrl = JSonUrl.replace('params', "invoiceUID");
			JSonUrl = JSonUrl.replace('paramValue',$("#actionDiv_InvoiceUID").attr("value"));
			
	        //Will check whether attachment already exist. If yes,display delete&release button.
			jQuery.getJSON(
				JSonUrl, // portlet resource url
				{},
				function(response) {

					if(response != null){
			
							if(response.authorized != undefined && response.authorized !="" && response.authorized == "false") {
			
								alertMessagePop ("displayMessage","Error",$("#noPermissionToViewMessage").val());
							}else{
								if(response.entity != undefined && response.entity != "" && response.entity!= null){
									response = eval('('+response.entity+')');
									//loop the response, if include file with name att_
									for(var x in response){
									var isAttachmentIncluded=x.indexOf("att_");
									
									if(isAttachmentIncluded!=-1){
										for (var j = 0; j < response[x].length; j++){
												if(typeof(response[x][j].object) != undefined){
                                                   var objStr=response[x][j].object;
												   var attIndex=objStr.lastIndexOf("/");
												   var objectID=objStr.substring(attIndex+1,objStr.length);
												   var tempFileName=x.substring(isAttachmentIncluded+4,x.length);
													$("#UploadAttachmentFileName").attr("filename",tempFileName);
												   $("#UploadAttachmentObjectID").val(objectID);
												   isUploadEnable=true;
													isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,false);
													isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,true);
													isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,true);
													isAttButtonDisplay($("#browseAttachmentBtn"),browseFunc,false);
																										
													isUploadEnable=false;
													$("#errMsg").show().css("color","green").append("<p>Attachment "+tempFileName+" already uploaded! Object_id :"+objectID+". You can delete the file if needed, or release the invoice.<p>");
													$("#uploadPopupDiv").dialog("open");
												}
											}
										}else{
										if(isUploadEnable){
												isAttButtonDisplay($("#browseAttachmentBtn"),browseFunc,true);
												isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,true);
												isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,false);
												isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,false);
												$("#uploadPopupDiv").dialog("open");
											}
										}
									}
			}
							}
			
					}
					{//if the invoice don't have any data, then set the same as no attachment available
										if(isUploadEnable){
												isAttButtonDisplay($("#browseAttachmentBtn"),browseFunc,true);
												isAttButtonDisplay($("#uploadAttachmentBtn"),uploadFunc,true);
												isAttButtonDisplay($("#deleteAttachmentBtn"),deleteFunc,false);
												isAttButtonDisplay($("#releaseAttachmentBtn"),releaseFunc,false);
												$("#uploadPopupDiv").dialog("open");
											}
										}
					
			});
			
			
			
			$("#uploadPopupDiv").dialog("open");
		});		
		$(document).on("click",".downloadInvoice",function(event){
			$("#displayMessage").html("");
		// $(".downloadInvoice").css("cursor", "pointer").live("click",function(event){ 
			//$("*").stop();
			//get the position of current event
			$("#displayMessage").html("");
			var messageDiv = document.getElementById("displayMessage");
			getEventPosition(event);
			$("#invoicePopupDiv").dialog("close");
			$("#invoicePopupDiv").html("");
			var div = $(this);
			var noRecord="";
			//initial some information for the common dialog
			noRecord=$("#noDateReceived").val();
			//$("#ui-dialog-title-invoicePopupDiv").html(divTitle);
			var JSonUrl = getPortletUrl();
			JSonUrl = JSonUrl.replace('serviceName', "SalesInvoiceManager");
            JSonUrl = JSonUrl.replace('resourceUrl', "searchInvoiceRevisionsByInvoiceUID");
			JSonUrl = JSonUrl.replace('methodValue', "searchInvoiceRevisionsByInvoiceUID");
            JSonUrl = JSonUrl.replace('params', "invoiceUID");
			JSonUrl = JSonUrl.replace('paramValue',$("#actionDiv_InvoiceUID").attr("value"));
			onStart();
	
			jQuery.getJSON(
				JSonUrl, // portlet resource url
				{},
				function(response) {
					// Handle AJAX Response.
					//You can define your own logic here
					if(response == null){
						$("#invoicePopupDiv").append(noRecord);
						$("#invoicePopupDiv").dialog("option", "position", [eventX, eventY]);
						$("#invoicePopupDiv").dialog("open");
					}else{
						try{
							if(response.authorized != undefined && response.authorized !="" && response.authorized == "false") {
								
								//messageDiv.style.color="red";
								//$("#displayMessage").html($("#noPermissionToViewMessage").val());
								alertMessagePop ("displayMessage","Error",$("#noPermissionToViewMessage").val());
							}else{
								if(response.entity != undefined && response.entity != "" && response.entity!= null){
									response = eval('('+response.entity+')');
									var popupJSonUrl = getViewAndDownPortletUrl();
									popupJSonUrl = popupJSonUrl.replace('serviceName', "SalesInvoiceManager");
									//loop the response, set the view or download resource url
									for(var x in response){
										if( x!= null && !isIgnorePredicate(x) && x!= "BypassDuplicateCheck" && x != "BatchID"){
//                                            x!= "BypassDuplicateCheck" && x != "BatchID"){
											for (var j = 0; j < response[x].length; j++){
												var tempViewJSonUrl = popupJSonUrl;
												var tempDloadJSonUrl = popupJSonUrl;
												if(typeof(response[x][j].object) != undefined){
                                                    //tempViewJSonUrl = tempViewJSonUrl.replace('viewDownload', "viewFile");
                                                    tempViewJSonUrl = tempViewJSonUrl.replace('paramA', "uri");
                                                    tempViewJSonUrl = tempViewJSonUrl.replace('paramB', "predicate");
													tempViewJSonUrl = tempViewJSonUrl.replace('method', "viewDownloadFlag");
                                                    tempViewJSonUrl = tempViewJSonUrl.replace('methodValue', "viewFile");
													tempViewJSonUrl = tempViewJSonUrl.replace('paramValueA', response[x][j].object);
													tempViewJSonUrl = tempViewJSonUrl.replace('paramValueB', x);
													//tempDloadJSonUrl = tempDloadJSonUrl.replace('viewDownload', "downloadFile");
													tempDloadJSonUrl = tempDloadJSonUrl.replace('paramA', "uri");
													tempDloadJSonUrl = tempDloadJSonUrl.replace('paramB', "predicate");
													tempDloadJSonUrl = tempDloadJSonUrl.replace('methodValue', "downloadFile");
													tempViewJSonUrl = tempViewJSonUrl.replace('method', "viewDownloadFlag");
                                                   // tempViewJSonUrl = tempViewJSonUrl.replace('methodValue', "downloadFile");
													tempDloadJSonUrl = tempDloadJSonUrl.replace('paramValueA', response[x][j].object);
													tempDloadJSonUrl = tempDloadJSonUrl.replace('paramValueB', x);
                                                    $("#invoicePopupDiv").append("<a href='"+tempViewJSonUrl+"'"
                                                    +" title='"+$("#viewTitle").val()+"' class='invoiceLink' "
                                                    +"target='_blank'>"+$("#viewLabel").val()+"</a>&nbsp;&nbsp;");
                                                    $("#invoicePopupDiv").append("<a href='"+tempDloadJSonUrl+"'"
                                                        +" title='"+$("#downloadTitle").val()+"' class='invoiceLink' "
                                                        +"target='_blank'>"+$("#downloadLabel").val()+"</a>&nbsp;&nbsp;");
													$("#invoicePopupDiv").append(x+"&nbsp;:&nbsp;"+response[x][j].time+"<br/>");
												}
											}
										}
									}
								}else if(response.entity == ""){
									$("#invoicePopupDiv").append($("#noResultForViewDownload").val());
								}else{
									$("#invoicePopupDiv").append(response.message);
								}
							}
						}catch(e){
							jQuery.event.trigger("ajaxStop");
							$("#invoicePopupDiv").append($("#exceptionInJs").val());
							$("#invoicePopupDiv").dialog("option", "position", [eventX, eventY]);
							$("#invoicePopupDiv").dialog("open");
						}
					}
			}).error(function(jqXHR, textStatus, errorThrown) {
				if(textStatus =='timeout'){
					isTimeout = true;
					//messageDiv.style.color="red";
					//$("#displayMessage").html(requestTimeOutMeg.replace("{0}","download invoice"));
					alertMessagePop ("displayMessage","Error",requestTimeOutMeg.replace("{0}","download invoice"));

				}else{
					//document.getElementById("displayMessage").style.color="red";
					//$("#displayMessage").html("Data service is not available. No data returned");
					alertMessagePop ("displayMessage","Error","Data service is not available. No data returned");
				}
				
			})
			.complete(function(event,xhr,options) {
				if(!isTimeout){
					isTimeout = false;
					if(event.status == 302||event.status == 0){
				   		window.location.reload(); 
					}else if(event.status != 200){
						$("#invoicePopupDiv").append($("#dataServiceNotAvailable").val());
					}
					$("#invoicePopupDiv").dialog("option", "position", [eventX, eventY]);
					$("#invoicePopupDiv").dialog("open");
				}		
			});
      //			}else{
     //				var messageDiv = document.getElementById("displayMessage");
     //				messageDiv.style.color="red";
      //				$("#displayMessage").html($("#noPermissionToViewMessage").val());
			//$("#invoicePopupDiv").html($(event.target).attr("data"));
			return false;
		});

		
		
		//change the byPass duplicate check 
		$(".checkDuplicate").css("cursor", "pointer");
		$(document).on("click",".checkDuplicate",function(event){
		// $(".checkDuplicate").css("cursor", "pointer").live("click",function(event){ 
			//$("*").stop();
			var spinnerPath=$("#spinnerPath").val();
			$("#displayMessage").html("");
			getEventPosition(event);
			var invoiceUIDForPass = $("#actionDiv_InvoiceUID").attr("value");
			$("#passCheckInvoiceUID").val(invoiceUIDForPass);
			$("#displayCheckPassMessage").html("");
			//when click the byPass icon,replace the current status of invoice with below gif,then replace with status after get status from backend successfully.
			// $("#currentStatus").html("<img src='/resource3/qtca/"+currentResourceVersion+"/images/ajax-loader.gif'/>");
			$("#currentStatus").html('<img class="spingif" src="/resource3/common/'+spinnerPath+'/images/spinning2.gif"/></img>');
			
			//passCheckInvoiceUID
			$("#checkPassDuplicateInvoiceDiv").dialog("option", "position", [eventX, eventY]);
			$("#checkPassDuplicateInvoiceDiv").dialog("open");
			var JSonUrl = getPortletUrl();
			JSonUrl = JSonUrl.replace('serviceName', "SalesInvoiceManager");
            JSonUrl = JSonUrl.replace('resourceUrl', "searchInoviceBypassDuplicateCheck");
			JSonUrl = JSonUrl.replace('methodValue', "searchInoviceBypassDuplicateCheck");
            JSonUrl = JSonUrl.replace('params', "invoiceUID");
			JSonUrl = JSonUrl.replace('paramValue', $("#actionDiv_InvoiceUID").attr("value"));		
			jQuery.getJSON(
				JSonUrl, // portlet resource url
				{},
				function(response) {
					// Handle AJAX Response.
					//You can define your own logic here
					if(response == null){
						var messageDiv = document.getElementById("displayCheckPassMessage");
						//messageDiv.style.color="red";
						//$("#displayCheckPassMessage").html($("#noDuplicateCheckStatusReturned").val());
						alertMessagePop ("displayMessage","Error",$("#noDuplicateCheckStatusReturned").val());
					}else{
						if(response.authorized != undefined && response.authorized !="" && response.authorized == "false") {
							var messageDiv = document.getElementById("displayCheckPassMessage");
							//messageDiv.style.color="red";
							//$("#displayCheckPassMessage").html($("#noPermissionToBypassCheckMessage").val());
							alertMessagePop ("displayMessage","Error",$("#noPermissionToBypassCheckMessage").val());
						}else{
							if(response.entity != undefined && response.entity != "" && response.entity!= null){
								if(response.entity == "on" ||response.entity =="On"||response.entity=="ON"){
									$("#currentStatus").html($("#currentStatusOn").val());
								}else if(response.entity == "off" ||response.entity =="Off"||response.entity=="OFF"){
									$("#currentStatus").html($("#currentStatusOff").val());
								}else{
									$("#currentStatus").html($("#currentStatusOnAndOff").val());
								}
							}else if(response.entity == ""){
								var messageDiv = document.getElementById("displayCheckPassMessage");
								//messageDiv.style.color="red";
								//$("#displayCheckPassMessage").html($("#noDuplicateCheckStatusReturned").val());
								alertMessagePop ("displayMessage","Error",$("#noDuplicateCheckStatusReturned").val());
							}else{
								var messageDiv = document.getElementById("displayCheckPassMessage");
								//messageDiv.style.color="red";
								//$("#displayCheckPassMessage").html(response.message);
								alertMessagePop ("displayMessage","Error",response.message);
							}
						}
					}
			}).error(function(jqXHR, textStatus, errorThrown) {
				if(textStatus =='timeout'){
					isTimeout = true;
					//document.getElementById("displayCheckPassMessage").style.color="red";
					//$("#displayCheckPassMessage").html(requestTimeOutMeg.replace("{0}","check duplicate"));
					alertMessagePop ("displayMessage","Error",requestTimeOutMeg.replace("{0}","check duplicate"));
				}else{
					// document.getElementById("displayCheckPassMessage").style.color="red";
					//$("#displayCheckPassMessage").html("Data service is not available. No data returned");
					alertMessagePop ("displayMessage","Error","Data service is not available. No data returned");
				}
			})
			.complete(function(event,xhr,options) {
				if(!isTimeout){
					isTimeout = false;
					if(event.status == 302||event.status == 0){
				  		 window.location.reload(); 
					}
				}
				
			});
			return false;
		});
		
		//canceled the invoice
		$(".cancel").css("cursor", "pointer");
		$(document).on("click",".cancel",function(event){
		// $(".cancel").css("cursor", "pointer").live("click",function(event){ 
			$("#displayMessage").html("");
			cancelInvoiceUID = $("#actionDiv_InvoiceUID").attr("value");
			cancelInvoiceTenant = $("#actionDiv_InvoiceUID").attr("tenant")||"HPQ";
			$("#dialog-confirm-cancel").dialog("open");
			return false;
		});
		
			//bulk reprocess selected invoices
		$("body" ).delegate( "#reprocessAllBtn", "click", function() {
			if(oTable != undefined && oTable != null){
				undefinedCulm = null;
				batchReprocessInvoiceIdsmap = {};
				undefinedCulm = $("input[name='checkColm']:checked", oTable.fnGetNodes());
				if(undefinedCulm.length == 0){
					$("#displayMessage").html();
					alertMessagePop ("displayMessage","Error",$("#noRecordReprocessed").val());
					return false;
				}else if(undefinedCulm.length > maxSelectNum){			
					alertMessagePop ("displayMessage","Error","Max number of invoice for bulk reprocess is "+maxSelectNum+". ");
					return false;
				}else{
						//open dialog
					$("#dialog-confirm-reprocess").dialog("open");
				}
				
				
			}else{
				var messageDiv = document.getElementById("displayMessage");
				//messageDiv.style.color="red";
				//$("#displayMessage").html($("#noRecordReprocessed").val());
				alertMessagePop ("displayMessage","Error",$("#noRecordReprocessed").val());
				return false;
			}
			return false;
		});
		
		//batch canceled selected invoices
		$(document).on("click","#cancelAllBtn",function(event){
			cancelInvoiceUID ='';
			cancelInvoiceTenant = '';
			batchCancelInvoiceIds = {};
			var selectedCount = 0;
			if(oTable != undefined){
				undefinedCulm = null;
				undefinedCulm = $("input[name='checkColm']:checked", oTable.fnGetNodes());
				selectedCount = undefinedCulm.length;
				for(var i=0;i<undefinedCulm.length;i++){
					//need push tenant value during cancel invoice
					var tenantValue = $(undefinedCulm[i]).attr("tenant")||"HPQ";
					batchCancelInvoiceIds[$(undefinedCulm[i]).val()] = tenantValue;
				}
				if(selectedCount==0){
					var messageDiv = document.getElementById("displayMessage");
					alertMessagePop ("displayMessage","Error",$("#noRecordCanceled").val());
					return false;				
				}else if(selectedCount > maxSelectNum){			
					alertMessagePop ("displayMessage","Error","Max number of invoice for bulk cancel is "+maxSelectNum+".");
					return false;	
				}else{					
					$("#displayMessage").html("");
					$("#dialog-confirm-cancel").dialog("open");
				}
			}else{
				var messageDiv = document.getElementById("displayMessage");
					//messageDiv.style.color="red";
					//$("#displayMessage").html($("#noRecordCanceled").val());
					alertMessagePop ("displayMessage","Error",$("#noRecordCanceled").val());
					return false;
			}
			return false;
		});
		
		//batch copy selected invoices
		$(document).on("click","#copyAllBtn",function(event){
			copyInvoiceUID ='';
			batchCopyInvoiceIds = new Array();
			if(oTable != undefined){
				undefinedCulm = null;
				undefinedCulm = $("input[name='checkColm']:checked", oTable.fnGetNodes());
				
				for(var i=0;i<undefinedCulm.length;i++){
					batchCopyInvoiceIds.push($(undefinedCulm[i]).val());
				}
				if(batchCopyInvoiceIds.length==0){
					var messageDiv = document.getElementById("displayMessage");
					alertMessagePop ("displayMessage","Error","No invoice can be copied.");
					return false;				
				}else if(batchCopyInvoiceIds.length > maxSelectNum){			
					alertMessagePop ("displayMessage","Error","Max number of invoice for bulk copy is "+maxSelectNum+".");
					return false;	
				}else{					
					$("#copyToTargetSelect").html("");
					var tmpSelectEnv = "";
					if ("PROD" == currentEnv) {	
						tmpSelectEnv = '<select id="select-environment" name="orgSelect" class="orgSelect">'
											+ '<option value="DEV">DEV</option>'
											+ '<option value="FT">FT</option>'
											+ '<option value="ITG" selected="selected">ITG</option>'	
									 + '</select>';
						
					} else if ("ITG" == currentEnv) {
						tmpSelectEnv = '<select id="select-environment" name="orgSelect" class="orgSelect">'
											+ '<option value="DEV">DEV</option>'
											+ '<option value="FT" selected="selected">FT</option>'
									 + '</select>';
						
					} else if ("FT" == currentEnv) {
						tmpSelectEnv = '<select id="select-environment" name="orgSelect" class="orgSelect">'
											+ '<option value="DEV">DEV</option>'
											+ '<option value="ITG" selected="selected">ITG</option>'											
									 + '</select>';
					} else if ("DEV" == currentEnv) {
						tmpSelectEnv = '<select id="select-environment" name="orgSelect" class="orgSelect">'
											+ '<option value="FT">FT</option>'
											+ '<option value="ITG" selected="selected">ITG</option>'	
									 + '</select>';
					}
					
					$("#copyToTargetSelect").html(tmpSelectEnv);
					$("#copyInvoiceDiv").dialog("close");
					$("#copyInvoiceDiv").dialog("option", "position", [,]);
					$("#copyInvoiceDiv").dialog("open");
					$("#select-environment").selecter({});
				}
			}else{
				var messageDiv = document.getElementById("displayMessage");
					//messageDiv.style.color="red";
					//$("#displayMessage").html($("#noRecordCanceled").val());
					alertMessagePop ("displayMessage","Error","No invoice can be copied.");
					return false;
			}
			return false;
		});
		
		function preTobatchReprocessInvoice (){
			//batchReprocessInvoiceIdsmap ={};
			//batchReprocessInvoiceIds =new Array();
			var reprocessInvoiceUuids = new Array();
			
			var isCopy = "";
			if(reprocessAs == 'original')
					isCopy = 'false';	
				else
					isCopy = 'true';		
			
			for(var i=0;i<undefinedCulm.length;i++){	
				var undefinedCulmVal;
				if($(undefinedCulm[i]).val() != undefined)		
					undefinedCulmVal	= $(undefinedCulm[i]).val();
				else
					undefinedCulmVal	= undefinedCulm[i];
				reprocessInvoiceUuids.push(undefinedCulmVal);				
			}	
			batchReprocessInvoiceIds.push(reprocessInvoiceUuids);			
			
			if(batchReprocessInvoiceIds.length>0){
				batchReprocessInvoice(reprocessInvoiceUuids, isCopy);
			}else{
				var messageDiv = document.getElementById("displayMessage");
				alertMessagePop ("displayMessage","Error",$("#noRecordReprocessed").val());
			}

		}
		
	
		
		//reprocess the invoice
		$(".reprocess").css("cursor", "pointer");	
		$(document).on("click",".reprocess",function(event){
		// $(".reprocess").css("cursor", "pointer").live("click",function(event){ 
			$("#displayMessage").html("");
				undefinedCulm= [];
				batchReprocessInvoiceIdsmap = {};
				undefinedCulm.push( $("#actionDiv_InvoiceUID").attr("value"));
				//getEventPosition(event);
				//$("#dialog-confirm-reprocess").dialog("option", "position", [eventX, eventY]);
				reprocessAs ="copy";
				$("#dialog-confirm-reprocess").dialog("open");
			// }
			return false;
		});
		
		//turn on or turn off the pass duplicate check
		$(".checkPassInvoice").css("cursor", "pointer");
		$(document).on("click",".checkPassInvoice",function(event){
		// $(".checkPassInvoice").css("cursor", "pointer").live("click",function(event){
			$("#displayMessage").html("");
			var statusFlag = $(this).attr("value");
			var uniqueIndentifyId = $("#passCheckInvoiceUID").val();
			var JSonUrl = getPortletUrl();
			var method = "";
			var isOn = false;
			var messageDiv = document.getElementById("displayCheckPassMessage");
			$("#displayCheckPassMessage").html("");
			if(statusFlag == "on" || statusFlag =="On"|| statusFlag == "ON"){
				method = "deleteInoviceBypassDuplicateCheck";
				isOn = true;
			}else{
				method = "addInoviceBypassDuplicateCheck";
				isOn = false;
			}
            JSonUrl = JSonUrl.replace('resourceUrl', method);
			JSonUrl = JSonUrl.replace('serviceName', "SalesInvoiceManager");
			JSonUrl = JSonUrl.replace('methodValue', method);
            JSonUrl = JSonUrl.replace('params', "invoiceUID");
			JSonUrl = JSonUrl.replace('paramValue', uniqueIndentifyId);
			

			onStart();
			jQuery.getJSON(
				JSonUrl, // portlet resource url
				{},
				function(response) {
					if(response == null){
						messageDiv.style.color="red";
						$("#displayCheckPassMessage").html($("#serviceNotAvailableInPassCheck").val());
						//alertMessagePop ("displayMessage","Error",$("#serviceNotAvailableInPassCheck").val());
					}else{
						try{
							if(response.authorized != undefined && response.authorized !="" && response.authorized == "false") {
								messageDiv.style.color="red";
								$("#displayCheckPassMessage").html($("#noPermissionToBypassCheckMessage").val());
								//alertMessagePop ("displayMessage","Error",$("#noPermissionToBypassCheckMessage").val());
							}else{
								if(response.entity != undefined && response.entity != "" && response.entity!= null){
									response = response.entity;
									if(response == "true"){
										messageDiv.style.color="green";
										$("#displayCheckPassMessage").html($("#turnDuplicateCheckResponseComment1").val()+" "+statusFlag+" "+$("#turnDuplicateCheckResponseComment2").val());
										//alertMessagePop ("displayMessage","Success",$("#turnDuplicateCheckResponseComment1").val()+" "+statusFlag+" "+$("#turnDuplicateCheckResponseComment2").val());
									}else{
										messageDiv.style.color="red";
										$("#displayCheckPassMessage").html(response);
										//alertMessagePop ("displayMessage","Error",response);
									}
								}else if(response.entity == ""){
									messageDiv.style.color="red";
									$("#displayCheckPassMessage").html($("#serviceNotAvailableInPassCheck").val());
									//alertMessagePop ("displayMessage","Error",$("#serviceNotAvailableInPassCheck").val());
								}else{
									messageDiv.style.color="red";
									$("#displayCheckPassMessage").html(response.message);
									//alertMessagePop ("displayMessage","Error",response.message);
								}
							}
						}catch(e){
							jQuery.event.trigger("ajaxStop");
							messageDiv.style.color="red";
							$("#displayCheckPassMessage").html($("#exceptionInJs").val());
							//alertMessagePop ("displayMessage","Error",$("#exceptionInJs").val());
						}
					}
			}).error(function(jqXHR, textStatus, errorThrown) {
				if(textStatus =='timeout'){
					isTimeout = true;
					document.getElementById("displayCheckPassMessage").style.color="red";
					$("#displayCheckPassMessage").html(requestTimeOutMeg.replace("{0}",""));
					//alertMessagePop ("displayMessage","Error",requestTimeOutMeg.replace("{0}",""));
				}else{
					 // do other things
					 document.getElementById("displayCheckPassMessage").style.color="red";
					$("#displayCheckPassMessage").html("Data service is not available. No data returned");
					//alertMessagePop ("displayMessage","Error","Data service is not available. No data returned");
				}
				
			}).complete(function(event,xhr,options) {
				if(!isTimeout){
					isTimeout = false;
					if(event.status == 302||event.status == 0){
				   		window.location.reload(); 
					}else if(event.status != 200){
						$("#displayCheckPassMessage").append($("#serviceNotAvailableInPassCheck").val());
					}
				}			
			});
			return false;
		});
		
		//view invoice history,it supports two kinds view modal,one is business view,it will just display some important information with a table
		//and another is technical view,it will show the whole message of the invoice with json string format.
		$(".viewHistory").css("cursor", "pointer");
		$(document).on("click",".viewHistory",function(event){						
	
		// $(".viewHistory").css("cursor", "pointer").live("click",function(event){
			$("#displayMessage").html("");
			$("#displayHistoryInvoiceUID").html("");
			getEventPosition(event);
			var tempInvoiceUID;
			historyTitle = (historyTitle==undefined||historyTitle=="")?$("#invoiceHistoryPopupDiv").prev().find("span.ui-dialog-title").html():historyTitle;
			$("#invoiceHistoryPopupDiv").dialog("close");
			$("#displayHistoryMessage").html("");
			$("#historyNiceViewTable").html("");
			$("#historyTechnicalView").html("");
			var historyTable = $("#historyNiceViewTable");
			historyTable.empty();
			//generate the history table for business view
			historyTable.append("<table id='viewHistory_result' class='TableBackground'><thead><tr class='TableHeaderRow'><th>"+$("#viewHistoryDate").val()+"</th><th>"+$("#viewHistoryType").val()+"</th>"+
				"<th>"+$("#viewHistoryState").val()+"</th><th>"+$("#viewHistoryEvent").val()+"</th><th>"+$("#viewHistoryDescription").val()+"</th></tr></thead><tbody></tbody></table>");
			historyOTable = $("#viewHistory_result").dataTable({
				//pagination style 
				"sPaginationType" : "commonStandard",
				"bPaginate" :true,
				"bJQueryUI": true,
				"bRetrieve": true, 
				"bDestroy": true, 
				"iDisplayLength": 25,
				// "sDom": '<"t_header"rClf><"t_body"t><"t_footer"pi>',
				"sDom":'<"t_header"l><"t_body"t><"t_footer"pi>',
				"bSortClasses": false,

				"oLanguage": {
					"sZeroRecords": $("#zeroRecordsForTable").val(),
					// "sInfo": $("#informationForTable").val(),
					"sLengthMenu": "<div class='sLengthText'>View Results of</div> _MENU_ ",
					"sInfoEmpty":"<span class='number_highlight'>0</span> items, <span class='number_highlight'>0</span> pages",
        			"sInfo": "<span class='number_highlight'>_TOTAL_</span> items, <span class='number_highlight'>_TOTALPAGE_</span> pages",
        			"sInfoFiltered": "",
					"oPaginate": { // define pagination button style
					"sFirst": "<i class='icon-double-angle-left'></i>",
					"sLast": "<i class='icon-double-angle-right'></i>",
					"sNext": "<i class='icon-angle-right'></i>",
					"sPrevious": "<i class='icon-angle-left'></i>"
					}

				},
				"bAutoWidth": true,
				"sScrollY": "360px",
				"aoColumns": [
						{"sWidth": 0.15*totalTableWidth },
						{"sWidth": 0.15*totalTableWidth },
						{"sWidth": 0.20*totalTableWidth },
						{"sWidth": 0.20*totalTableWidth},
						{"sWidth": 0.30*totalTableWidth }
					]
			});
			$("#viewHistory_result_length select").selecter({bAlpha:false});

			var JSonUrl = getPortletUrl();
			var tenant = $("#actionDiv_InvoiceUID").attr("tenant");
			JSonUrl = JSonUrl.replace('serviceName', "SalesInvoiceManager");
            JSonUrl = JSonUrl.replace('resourceUrl', "searchInvoiceHistoriesByInvoiceUID");
			JSonUrl = JSonUrl.replace('methodValue', "searchInvoiceHistoriesByInvoiceUID");
            JSonUrl = JSonUrl.replace('params', "invoiceUID");
			JSonUrl = JSonUrl.replace('tenantValue', tenant);
			if(tenant=="HPI" &&　$("#actionDiv_InvoiceUID").attr("BDOType")=="DDSEnterpriseSalesInvoice"){
				JSonUrl = JSonUrl.replace('bdoTypeValue', "DDSInvoiceUID");
			}else{
				JSonUrl = JSonUrl.replace('bdoTypeValue', "InvoiceUID");
			}
			JSonUrl = JSonUrl.replace('paramValue', $("#actionDiv_InvoiceUID").attr("value"));

			onStart();
			jQuery.getJSON(
				JSonUrl, // portlet resource url
				{},
				function(response) {
					// Handle AJAX Response.
					//You can define your own logic here
					if(response == null){
						document.getElementById("displayHistoryMessage").style.color="red";
						$("#displayHistoryMessage").append($("#noHistoryFound").val());
					}else{
						try{
							if(response.authorized != undefined && response.authorized !="" && response.authorized == "false") {
								document.getElementById("displayHistoryMessage").style.color="red";
								$("#displayHistoryMessage").append($("#noPermissionToViewHistory").val());
							}else{
								//set the response invoice data into aaData array,which will be add into history datatable
								if(response.entity != undefined && response.entity != "" && response.entity!= null){
									response = JSON.parse(response.entity);//eval('('+response.entity+')');
									aaHistoryData = [];
									availableHistoryType=[];
									for (var i = 0; i < response.length; i++){
										data=response[i];
										tempInvoiceUID = (data.objectId!=undefined)?data.objectId:$("#actionDiv_InvoiceUID").attr("value");
										// tempInvoiceUID = (tempInvoiceUID==undefined)?data.objectId:tempInvoiceUID;
										try{
											if(!$.isEmptyObject(data)){
												if($.inArray(data.type,availableHistoryType) === -1){
													availableHistoryType.push(data.type);
												}
												aaHistoryData.push([
													data.eventDatetime.replace("T"," "),
													data.type,
													data.status,
													data.name,
													data.comment
												]);
												//append the history record into the technical view div
												$("#historyTechnicalView").append($.toJSON(data)+"<br/><br/>");
											}
										}catch(e){}
									}
									historyOTable.fnAddData(aaHistoryData);
									document.getElementById("displayHistoryMessage").style.color="green";
									$("#displayHistoryMessage").html("");
									//$("#displayHistoryInvoiceUID").html(tempInvoiceUID);
									$("#invoiceHistoryPopupDiv").prev().find("span.ui-dialog-title").html(historyTitle+"  - <span class='historycolor'> InvoiceUID:["+tempInvoiceUID+"]</span>");
									generateSelectOption("historyStateDropdown",availableHistoryType,"MILESTONE");
									historyOTable.fnDraw();
									historyOTable.fnAdjustColumnSizing();
								}else if(response.entity == ""){
									document.getElementById("displayHistoryMessage").style.color="red";
									$("#displayHistoryMessage").append($("#noHistoryFound").val());
                                    generateSelectOption("historyStateDropdown",[],"MILESTONE");
								}else{
									document.getElementById("displayHistoryMessage").style.color="red";
									$("#displayHistoryMessage").append(response.message);
                                    generateSelectOption("historyStateDropdown",[],"MILESTONE");
								}
							}
						}catch(e){
							jQuery.event.trigger("ajaxStop");
							document.getElementById("displayHistoryMessage").style.color="red";
                            generateSelectOption("historyStateDropdown",[],"MILESTONE");
							$("#displayHistoryMessage").append($("#exceptionInJs").val());
							$("#invoiceHistoryPopupDiv").dialog("option", "position", [eventX, eventY]);
							$("#historyNiceViewTable").show();
							$("#historyTechnicalView").hide();							 
							$("#defaultView").attr("checked",'checked');
							$("#invoiceHistoryPopupDiv").dialog("open");
							setTimeout(function () {
							    historyOTable.fnAdjustColumnSizing();
							}, 10);	
						}
					}
			}).error(function(jqXHR, textStatus, errorThrown) {
				if(textStatus =='timeout'){
					isTimeout = true;
					document.getElementById("displayHistoryMessage").style.color="red";
					$("#displayHistoryMessage").html(requestTimeOutMeg.replace("{0}","view invoice history"));
				}else{
					 // do other things
					 document.getElementById("displayHistoryMessage").style.color="red";
						$("#displayHistoryMessage").html("Data service is not available. No data returned");
				}
			})
			.complete(function(event,xhr,options) {
                $("select.historyStateDropdown").multiselect({
                    noneSelectedText: '',
                    selectedText: ''
                });
                $("select.historyStateDropdown").multiselect("refresh");
                $("button.ui-multiselect span:eq(0)").remove();
                $(".ui-multiselect-header").parent().addClass("ui-dialog");
                $(".ui-multiselect-header").empty();
                $(".ui-multiselect-header").append("<input type='checkbox' id='checkedListAll' class='ui-multiselect-all'/>Check All");
                $("#checkedListAll").click(function(){
                    if($("#checkedListAll").prop("checked")){
                        $("select.historyStateDropdown").multiselect("checkAll");
                    }
                    else{
                        $("select.historyStateDropdown").multiselect("uncheckAll");
                    }

                });
                $(".selectFilterType button").empty();
                $(".selectFilterType button").append("<i class='icon-filter icon-large Cblue'></i>");

                $("#checkedListAll").parent().parent().find("input[name^='multiselect']").click(function(){
                    var uncheckedCulm = $("#checkedListAll").parent().parent().find("input[name^='multiselect'][checked!='checked']");
                    if(uncheckedCulm.length == 0){
                        $("#checkedListAll").prop("checked", true);
                    }
                    else{
                        $("#checkedListAll").prop("checked", false);
                    }
                });
                if(!isTimeout){
                	isTimeout = false;
                	 if(event.status == 302||event.status == 0){
						window.location.reload(); 
					}else if(event.status != 200){
						document.getElementById("displayHistoryMessage").style.color="red";
						$("#displayHistoryMessage").append($("#dataServiceNotAvailable").val());
					}
               	}
              	$(".dataTables_scrollHeadInner").width("99%");
              	historyWidth = $(window).width()*0.9;
                $("#invoiceHistoryPopupDiv").dialog("option", "width",historyWidth);
				$("#historyNiceViewTable").show();
				$("#historyTechnicalView").hide();
				$("#defaultView").attr("checked",'checked'); 
				$("#invoiceHistoryPopupDiv").dialog("open");
				setTimeout(function () {
				    historyOTable.fnAdjustColumnSizing();
				}, 10);	
				
			});
			//$("#invoicePopupDiv").html($(event.target).attr("data"));
			return false;
		});
		
		//radio button change event for different view mode,it will control the history display modal for different view
		$(".historyRadionButton").click(function(){
			
			if($(this).val() == "default"){
				$("#historyNiceViewTable").show();
				$("#historyTechnicalView").hide();
			}else{
				$("#historyNiceViewTable").hide();
				$("#historyTechnicalView").show();
			}
		});

		$(".historyRadionButton+label").click(function(){
			
			if($(this).prev().val() == "default"){
				$("#historyNiceViewTable").show();
				$("#historyTechnicalView").hide();
			}else{
				$("#historyNiceViewTable").hide();
				$("#historyTechnicalView").show();
			}
		});



		
		// search the document after page is loaded
		//DocumentForm.search();
		
		//stop propagation and initial event position
		function getEventPosition(event){
			event.stopPropagation();
			var e=event?event:window.event;
			t=e.target||e.srcElement;
			eventX= event.clientX+$(this).scrollLeft()+10;
			eventY= event.clientY+10;
		};

	//select
		// $('.ui-datepicker-month').addClass('aa');
		// $("#state").selecter({ defaultLabel: "<span style='color:#007dba;'>Select Items</span>" });
		$('#state').selecter({inputFilter:true,firstOption: "All"});
		$('#businessOperSlct').selecter({inputFilter:true,firstOption: "All"});
		$('#incoiveTypeSlct').selecter({inputFilter:true,firstOption: "All"});
		$('#invtocountrycd').selecter({ inputFilter:true});
		$('#shiptocountrycd').selecter({ inputFilter:true});
		$('#soldtocountrycd ').selecter({ inputFilter:true});
		
		
		$(".selecter-options span").each( function() { 
				var SelecterOptions=$(this).text();
				$(this).attr("title", SelecterOptions ); 
			});


		$('#incoiveTypeSlct,#businessOperSlct,#state').change(function(){

			$("span.selecter-selected").each( function() { 
				var SelecterOptions=$(this).text();
				$(this).attr("title", SelecterOptions ); 
			});
		});

		

		// $('select.ui-datepicker-month').selecter();
		// $('#ui-datepicker-div').find('select.ui-datepicker-month').addClass('aa');
		

		// $('.ui-datepicker-month').selecter();

	//Form.Triger
		$(".SearchClose").click(function(){
		
						if(($("#searchContent").css('display'))=="block"){
							$(this).css({"background-position":"left -1950px"});
							$("#searchContent").slideUp("slow");		 
							}		
						else{
							 $(this).css({"background-position":"left -2085px"});
							 $("#searchContent").slideDown("slow");			 
						}
			});

 		$(document).on("click",".viewHistory",function(){
 				$("#defaultView").prop("checked",true); 
 							            		
                	if(navigator.appVersion.indexOf("MSIE 8.")!=-1)
		                {
						$("input[type='radio'][class*='cstmeinput']:checked").next().find('span').addClass("rcheckclass");          
		                $("input[type='radio'][class*='cstmeinput']:not(:checked)").next().find('span').removeClass("rcheckclass");
		               }
		          
		});

				//invoice deeplink
        if($("#hiddenSearchType").val()!="" && $("#hiddenSearchType").val()!= undefined && $("#hiddenSearchType").val() == "invoiceSearch"){
            var dpInvoiceNumber = $("#hiddenInvoiceNumber").val();
            var dpUIDNumber=   $("#hiddenUIDNumber").val();
            var dpBuinessOperationModel = $("#hiddenBuinessOperationModel").val();
            var dpCustomerIdCBN = $("#hiddenCustomerIdCBN").val();
            var dpHPSAPOrder = $("#hiddenHPSAPOrder").val();
            var dpInvoiceType = $("#hiddenInvoiceType").val();
            var dpInvoiceFromDate = $("#hiddenInvoiceFromDate").val();
            var dpInvoiceToDate= $("#hiddenInvoiceToDate").val();

            $("#resetFilters").trigger("click");
            $("#invid").val(dpInvoiceNumber);
            $("#businessOperSlct").val(dpBuinessOperationModel);
            if(dpBuinessOperationModel!=""){
            	$('#businessOperSlct').selecter("refresh");
            }
            $("#custid").val(dpCustomerIdCBN);
            $("#hporder").val(dpHPSAPOrder);
            $("#incoiveTypeSlct").val(dpInvoiceType);
            if(dpInvoiceType!=""){
            	$('#incoiveTypeSlct').selecter("refresh");
            }
            $("#fromDate").val(dpInvoiceFromDate);
            $("#toDate").val(dpInvoiceToDate);
            $("#invoiceUID").val(dpUIDNumber);
            // $("#searchBtn").trigger("click");
            $("#searchBtn").click();

        }
		
		
		
	});

	//the documentForm contains some function for the form.like serialize the form inputs,generate the search resource url
	var DocumentForm = {
		serializeSearchCriteria2JSON : function(id) {
			//var result = $(id).serializeArray();
			var result = $(id+" :not(.selcheck)").serializeArray();
			var record = {};
			var invoiceDate = "";
			var transmissionDate="";
			var ReceiveDate ="";
			var invoicestate=0; 

			var country= "";
			var soldTCountry ="";
			var shipTCountry="";
			$.each(result, function() {
				// if(!((this.name == "state") ||(this.name == "batchid" && this.value == "")|| this.name == "fromDate" || this.name == "toDate"||this.name == "transmissionFromDate" || this.name == "transmissionTODate"|| this.name == "abnormalties")){
				if(!((this.name == "state" && this.value == "") ||(this.name == "batchid" && this.value == "")|| this.name == "fromDate" || this.name == "toDate"||this.name == "transmissionFromDate" || this.name == "transmissionTODate"|| this.name == "abnormalties" || (this.name == "invtocountrycd") 
				|| (this.name == "soldtocountrycd") || (this.name == "shiptocountrycd")  || (this.name == "localcountryinvno")|| (this.name == "ReceiveFromDate")  || (this.name == "ReceiveToDate"))){
					if (record[this.name] !== undefined) {
						if (!record[this.name].push) {
							record[this.name] = [ record[this.name] ];
						}
					record[this.name].push(this.value || '');
					} else {
						record[this.name] = this.value || '';
					}
				}

				// else if(this.name=="state"&& this.value != ""){

				// 	if(convertUndefinedValue(this.value) != null && convertUndefinedValue(this.value) != ""){

				// 		invoicestate++;
				// 		// console.log(invoicestate);
				// 		// record[this.name].push(this.value || '');

				// 	}


				//}

				else if(this.name == "fromDate"){
					if(convertUndefinedValue(this.value) != null && convertUndefinedValue(this.value) != ""){
						var startDate = new Date(this.value);
						startDate = getFormatDate(startDate,"yyyy-MM-dd");
						invoiceDate += startDate;
					}
					//invoiceDate += this.value;
				}else if(this.name == "toDate"){
					if(convertUndefinedValue(this.value) != null && convertUndefinedValue(this.value) != ""){
						var toDate = new Date(this.value);
						toDate = getFormatDate(toDate,"yyyy-MM-dd");
						invoiceDate += "/"+toDate;
					}else{
						if(invoiceDate!=null&&invoiceDate!=""){
							var toDate=new Date($.ajax({async:false}).getResponseHeader("Date"));
							toDate = getFormatDate(toDate,"yyyy-MM-dd");
							invoiceDate += "/"+toDate;
						}
					}
					//invoiceDate += "/"+this.value;
				}else if(this.name == "transmissionFromDate"){
					if(convertUndefinedValue(this.value) != null && convertUndefinedValue(this.value) != ""){
						var startDate = new Date(this.value);
						//startDate = startDate.getTime();
						startDate = getFormatDate(startDate);
						transmissionDate += startDate;
					}
					//transmissionDate += this.value;
				}else if(this.name == "transmissionTODate"){
					if(convertUndefinedValue(this.value) != null && convertUndefinedValue(this.value) != ""){
						var toDate = new Date(this.value);
						toDate = getFormatDate(toDate);
						//toDate = toDate.getTime();
						transmissionDate += "/"+toDate;
					}else{
						if(transmissionDate!=null&&transmissionDate!=""){
							var toDate=new Date($.ajax({async:false}).getResponseHeader("Date"));
							toDate = getFormatDate(toDate);
							//toDate = toDate.getTime();
							transmissionDate += "/"+toDate;
						}
					}
			
				}else if(this.name == "ReceiveFromDate"){
					if(convertUndefinedValue(this.value) != null && convertUndefinedValue(this.value) != ""){
						var startDate = new Date(this.value);
						//startDate = startDate.getTime();
						startDate = getFormatDate(startDate);
						ReceiveDate += startDate;
					}
		
				}else if(this.name == "ReceiveToDate"){
					if(convertUndefinedValue(this.value) != null && convertUndefinedValue(this.value) != ""){
						var toDate = new Date(this.value);
						toDate = getFormatDate(toDate);
						//toDate = toDate.getTime();
						ReceiveDate += "/"+toDate;
					}else{
						if(ReceiveDate!=null&&ReceiveDate!=""){
							var toDate=new Date($.ajax({async:false}).getResponseHeader("Date"));
							toDate = getFormatDate(toDate);
							//toDate = toDate.getTime();
							ReceiveDate += "/"+toDate;
						}
					}
					
				}else if(this.name == "abnormalties"){
					if(this.value == "on"){
						record['reviewEvents'] = "true" || '';
					}
				}else if(this.name == "invtocountrycd"){
					country += (this.value +",") || '';
						record['invtocountrycd'] = country.substring(0,country.length-1)|| '';
					
				}else if(this.name == "shiptocountrycd"){
					shipTCountry += (this.value +",") || '';
						record['shiptocountrycd'] = shipTCountry.substring(0,shipTCountry.length-1)|| '';
					
				}else if(this.name == "soldtocountrycd"){
					soldTCountry += (this.value +",") || '';
						record['soldtocountrycd'] = soldTCountry.substring(0,soldTCountry.length-1)|| '';
					
				}else if(this.name == "localcountryinvno"){
						record['localcountryinvno'] = this.value || '';
					
				}
				
			});
			if($.trim(invoiceDate) != "/" && $.trim(invoiceDate) != ""){
				if(invoiceDate.indexOf("/") == 0){
					var toDate = new Date($("#toDate").val());
					toDate.setFullYear(toDate.getFullYear() - 10);
					var fromDate=getFormatDate(toDate,"yyyy-MM-dd");
					invoiceDate=fromDate+invoiceDate;
				}
				record['invdt'] = invoiceDate || '';
			}
			if($.trim(transmissionDate) != "/" && $.trim(transmissionDate) != ""){
				if(transmissionDate.indexOf("/") == 0){
					//var invoiceDateStr=transmissionDate.substring(1,transmissionDate.length);
					var toDate = new Date($("#transmissionTODate").val());
					toDate.setFullYear(toDate.getFullYear() - 10);
					//var fromDate = toDate.getTime();
					var fromDate = getFormatDate(toDate);
					transmissionDate=fromDate+transmissionDate;
				}
				record['transmissiondt'] = transmissionDate || '';
			}
			if($.trim(ReceiveDate) != "/" && $.trim(ReceiveDate) != ""){
				if(ReceiveDate.indexOf("/") == 0){
					//var invoiceDateStr=ReceiveDate.substring(1,ReceiveDate.length);
					var toDate = new Date($("#ReceiveToDate").val());
					toDate.setFullYear(toDate.getFullYear() - 10);
					//var fromDate = toDate.getTime();
					var fromDate = getFormatDate(toDate);
					ReceiveDate=fromDate+ReceiveDate;
				}
				record['invrecvdt'] = ReceiveDate || '';
			}
			//record['Suppress'] = "false" || '';

			return $.toJSON(record);
		},
		
		search : function() {
			
			var JSonUrl = getPortletUrl();
			JSonUrl = JSonUrl.replace('serviceName', "SalesInvoiceManager");
            JSonUrl = JSonUrl.replace('resourceUrl', "searchInvoiceInfo");
			JSonUrl = JSonUrl.replace('methodValue', "searchInvoiceInfo");
			//JSonUrl = JSonUrl.replace('paramValue', DocumentForm.serializeSearchCriteria2JSON("#form"));
            JSonUrl = JSonUrl.replace('params', "searchCriteria");
			//var test=DocumentForm.serializeSearchCriteria2JSON("#fieldset");
			JSonUrl = JSonUrl.replace('paramValue', encodeURIComponent(encodeURIComponent(encodeURIComponent(DocumentForm.serializeSearchCriteria2JSON("#fieldset"),"UTF-8"),"UTF-8"),"UTF-8"));
			ajaxCall(JSonUrl);
			// if($('.accordion h2 ~ div')[1].style.display == 'none' ||$('.accordion h2 ~ div')[1].style.display == ''){
				// $('.accordion h2')[1].click();
			// }
			return false;
			
		},

		list : function(docs) {

		}
	};
	
	//this function is used to raise a request to download the invoice file with given id
	//it is not used anymore,can be removed
	this.downloadPDF = function(id) {
		var JSonUrl = setPortletUrl();
		JSonUrl = JSonUrl.replace('serviceName', "InvoiceService");
		JSonUrl = JSonUrl.replace('methodValue', "download");
		JSonUrl = JSonUrl.replace('param', id);
		var aForm = $("#modifyForm");
		$("#modifyForm")[0].action = JSonUrl;
		$("#modifyForm").submit();
	}
	
	//it is used to hide div with given id
	//not used anymore,can be removed
	this.hideMessage = function(id) {
		$("#"+id).hide();
	}
	
	this.getIndexOfTh = function(th){
		var tmpCols = oTable.fnSettings().aoColumns;
		var indexOfTh = -1;
		$.each(oTable.fnSettings().aoColumns, function (index, value) { 
			var name = value.nTh.attributes.getNamedItem("name").nodeValue;
			if(name == th){
				indexOfTh = index;
			}
		});
		return indexOfTh;
	};
	
	//return the x position of event and it will careless the browser
	this.getPointerX = function(event) {
		return event.pageX || (event.clientX +(document.documentElement.scrollLeft || document.body.scrollLeft));
	}
	//return the y position of event and it will careless the browser
	this.getPointerY = function(event) {
		return event.pageY || (event.clientY +(document.documentElement.scrollTop || document.body.scrollTop));
	}
	
	//the onstart function can be invoked by the ajax which want to popup a modal div for the ajax call
	this.onStart=function(event){
		// $("#loading_page").show();
		var spinnerPath=$("#spinnerPath").val();
		$.blockUI({ 
			message: '<img src="/resource3/common/'+spinnerPath+'/images/spinning2.gif"/></img>' ,
			css:{
				border: 'none',             
            	backgroundColor: 'none'
            }
		});
	}
	
	//table2csv function can be used to tranfer the data in the datatable into csv format string
	this.table2csv = function(oTable, exportmode, tableElm) {
        var csv = '';
        var headers = [];
        var rows = [];
		var excludedIndex = [];
        // Get header names
		$.each(oTable.fnSettings().aoColumns, function (index, value) { 
			var name = value.nTh.attributes.getNamedItem("name").nodeValue;
			var content = value.nTh.textContent;
			var innerHTML = value.nTh.innerHTML;
			var sTitle = value.sTitle;
			if(name != "statusLight" && name !="action" && name !="checkboxColm"){
				var header = '"' + sTitle + '"';
				// headers.push(header); // original code
				if(sTitle != ""){
					headers.push(header);
				}
			}else{
				excludedIndex.push(index);
			}
		});
		/*
        $('#'+tableElm+' thead th').each(function() {
            var $th = $(this);
            var text = $th.text();
            var header = '"' + text + '"';
            // headers.push(header); // original code
            if(text != "") headers.push(header); // actually datatables seems to copy my original headers so there ist an amount of TH cells which are empty
        });*/
        csv += headers.join(',') + "\n";
        // get table data
        if (exportmode == "full") { // total data
            var total = oTable.fnSettings().fnRecordsTotal();
            for(i = 0; i < total; i++) {
                //var row = oTable.fnGetData(i);
				var row = "";
				var data = oTable.fnGetData(i);
				for(var l=0;l<data.length;l++){
					if($.inArray(l,excludedIndex) === -1){
						row += filterCommaInCell((data[l]==null?" ":data[l])) + ",";
					}
				}
				row = row.substring(0, row.length - 1);
                row = strip_tags(row);
                rows.push(row);
            }
        }else{ // visible rows only
            $('#'+tableElm+' tbody tr:visible').each(function(index) {
               // var row = oTable.fnGetData(this);
				var data = oTable.fnGetData(this);
				var row = "";
				for(var l=0;l<data.length;l++){
					if($.inArray(l,excludedIndex) === -1){
						row += filterCommaInCell((data[l]==null?" ":data[l])) + ",";
					}
				}
				row = row.substring(0, row.length - 1);
                row = strip_tags(row);
                rows.push(row);
            })
        }
        csv += rows.join("\n");
		return csv;
	}

	
	
    function filterCommaInCell(row){
        var patrn=/,+/;
        if (!patrn.exec(row)){
            return row;
        }
        return "\""+row+"\"";
    }
	function strip_tags(html) {
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		return tmp.textContent||tmp.innerText;
	}

	function isIgnorePredicate(predictaeString){
	 	if(filterPrefixedDoc =='no'){
	 		return false;
	 	}else{
	 		 var patrn=/^_{1}\w+$/;
        	 if (!patrn.exec(predictaeString)){
            	 return false;
         	 }
         	 return true;
	 	}
     }
	function generateSelectOption(selectClass,optionArray,defaultVal){
		$("select."+selectClass).empty();
		var returnString = "";
		for(var i =0; i<optionArray.length;i++){
			if(typeof optionArray[i] == "object" || optionArray[i] === null){
				returnString += '<OPTGROUP label="'+Object.keys(optionArray[i])[0]+'">';
				var subGroupOpt = optionArray[i][Object.keys(optionArray[i])[0]];
				for(var j = 0;j < subGroupOpt.length ;  j++){
					var optvalue =subGroupOpt[j];
					var optlable =subGroupOpt[j];
					if(subGroupOpt[j].indexOf("(")!=-1){
						optvalue = subGroupOpt[j].substring(0, subGroupOpt[j].indexOf("("));
						optlable = subGroupOpt[j].substring(subGroupOpt[j].indexOf("(")+1,subGroupOpt[j].indexOf(")"));
					}
					if(optvalue==defaultVal){
						returnString += '<option value="'+optvalue+'" selected>'+optlable+'</option>';
					}
					else{
						returnString += '<option value="'+optvalue+'">'+optlable+'</option>';
					}
				}
				returnString += '</OPTGROUP>';
				
			}
			else if(optionArray[i] == defaultVal){
				returnString += '<option value="'+optionArray[i]+'" selected>'+optionArray[i]+'</option>';
			}else{
				returnString += '<option value="'+optionArray[i]+'">'+optionArray[i]+'</option>';
			}
		}
		$("select."+selectClass).append(returnString);
	}

	function generateBomOption(selectClass,optionArray,defaultVal){
		$("select."+selectClass).empty();
		var returnString = "";
		var generateAllValue="";
		if(defaultVal=="All"){
			returnString += '<option value="generateAllValue" selected>All</option>';
		}
		for(var i =0; i<optionArray.length;i++){
			if(typeof optionArray[i] == "object" && optionArray[i] != null){
				if(optionArray[i].children.length==0){
					if(optionArray[i].paramValue==defaultVal){
						returnString += '<option value="'+optionArray[i].paramValue+'" selected>'+optionArray[i].paramDisplayName+'</option>';
						generateAllValue += optionArray[i].paramValue+",";
					}
					else{
						returnString += '<option value="'+optionArray[i].paramValue+'">'+optionArray[i].paramDisplayName+'</option>';
						generateAllValue += optionArray[i].paramValue+",";
					}
				}
				else{
					returnString += '<OPTGROUP label="'+optionArray[i].paramDisplayName+'">';
					var subGroupOpt = optionArray[i].children;
					for(var j = 0;j < subGroupOpt.length ;  j++){
						if(subGroupOpt[j].paramValue==defaultVal){
							returnString += '<option value="'+subGroupOpt[j].paramValue+'" selected>'+subGroupOpt[j].paramDisplayName+'</option>';
							generateAllValue += subGroupOpt[j].paramValue+",";
						}
						else{
							returnString += '<option value="'+subGroupOpt[j].paramValue+'">'+subGroupOpt[j].paramDisplayName+'</option>';
							generateAllValue += subGroupOpt[j].paramValue+",";
						}
					}
					returnString += '</OPTGROUP>';
				}
			}
		}
		generateAllValue=generateAllValue.substring(0,generateAllValue.lastIndexOf(","));
		returnString = returnString.replace("generateAllValue",generateAllValue);
		$("select."+selectClass).append(returnString);
	}



	function generateSelectOptionwithID(selectClass,optionArray,defaultVal){
		$("select."+selectClass).empty();
		var returnString = "";
		for(var i =0; i<optionArray.length;i++){
			if(optionArray[i] == defaultVal){
				returnString += '<option value="'+optionArray[i]+'" selected>'+optionArray[i]+'</option>';
			}else{
				var Id=optionArray[i].split("&");
				returnString += '<option value="'+Id[1]+'">'+Id[0]+'</option>';
			}
		}
		$("select."+selectClass).append(returnString);
	}

	function submitfunc() {
		DocumentForm.search();
		return false;
	}

	function resetSelecterPlugin(selectId){                                                 
       var setDefaultVaule = $("#"+selectId+" + .selecter .selecter-options .first").attr("data-value");
        if ($("#"+selectId).val()!= setDefaultVaule) {
              var setDefaultLabel = $("#"+selectId+" + .selecter .selecter-options .first").html();
              $("#"+selectId).val(setDefaultVaule);
              $("#"+selectId+" + .selecter .selecter-selected").html(setDefaultLabel);
              $("#"+selectId+" + .selecter .selecter-options span").removeClass("selected");
              $("#"+selectId+" + .selecter .selecter-options .first").addClass("selected");
       }
    } 
    function resetSelecterNoDefPlugin(selectId){     
      	//var setDefaultLabel = $("#"+selectId+" + .selecter .selecter-options .first").html();                                         
		$("#"+selectId).val('');
		$("#"+selectId+" + .selecter .selecter-selected").html('');
		$("#"+selectId+" + .selecter .selecter-selected").attr("title","");
        $("#"+selectId+" + .selecter .selecter-options span").removeClass("selected");
         // $("#"+selectId+" + .selecter .selecter-options .first").addClass("selected");
     
    } 
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
 	function alertMessagePopNotDisMeg(divId, status, messages,noDisMeg){       
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
                    configMessage(divId,"red",messages+noDisMeg);
                }
                else{
                    configMessage(divId,"green",messages+noDisMeg);
                }
             }
         });
        }, 2000);  

	}	
        
})(jQuery);