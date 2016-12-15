<%@page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@page import="com.hp.it.qtca.auth.UserProfileUtil"%>
<%@page import="com.hp.it.qtca.invoicesearch.dao.properties.util.PropertiesUtil" %>
<%@page import="com.hp.it.qtca.url.uitl.SecurityUtil" %>
<%@page import="com.hp.it.qtca.invoicesearch.dao.properties.factory.PropertiesWrapperFactory" %>
<%@page import="com.hp.it.qtca.ac.util.ACUtil" %>
<%@page import="com.hp.it.qtca.invoicesearch.controller.SearchInvoiceController" %>

<portlet:defineObjects />
<portlet:resourceURL var="resourceUrl" escapeXml="false"
	id="resourceUrl">
	<portlet:param name="service" value="serviceName" />
	<portlet:param name="method" value="methodValue" />
	<portlet:param name="params" value="paramValue" />
	<portlet:param name="tenant" value="tenantValue" />
	<portlet:param name="bdoType" value="bdoTypeValue" />
	<portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>
<portlet:resourceURL var="copyInvoices" escapeXml="false"
	id="copyInvoices">
	<portlet:param name="environment" value="environmentValue" />
	<portlet:param name="invoiceUID" value="invoiceUIDValue" />
	<portlet:param name="isCopy" value="isCopyValue" />
	<portlet:param name="operator" value="operatorValue" />
	<portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>
<portlet:resourceURL var="viewDownloadURL" escapeXml="false"
	id="viewDownload">
	<portlet:param name="service" value="serviceName" />
	<portlet:param name="method" value="methodValue" />
	<portlet:param name="paramA" value="paramValueA" />
	<portlet:param name="paramB" value="paramValueB" />
	<portlet:param name="paramC" value="paramValueC" />
	<portlet:param name="tenant" value="tenantValue" />
	<portlet:param name="bdoType" value="bdoTypeValue" />
	<portlet:param name="docType" value="docTypeValue" />
	<portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>
<portlet:resourceURL var="exportCsvFile" escapeXml="false" id="exportCsvFile">
	<portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>
<!-- <portlet:resourceURL var="checkIfOperationAuthorized" escapeXml="false" id="checkIfOperationAuthorized">
	<portlet:param name="operation" value="operationValue" />
</portlet:resourceURL>	   -->
<!-- <portlet:resourceURL var="getAuthorizedOperations" escapeXml="false" id="getAuthorizedOperations">
</portlet:resourceURL> -->
<portlet:resourceURL var="sendEmail" escapeXml="false" id="sendEmail">
</portlet:resourceURL>


<portlet:actionURL var="uploadAttachmentData" name="uploadAttachmentData">
	<portlet:param name="invoiceUID" value="invoiceUIDValue"/>
	<portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:actionURL>
<portlet:resourceURL var="deleteAttachmentData" escapeXml="false"
	id="deleteAttachmentData">
	<portlet:param name="invoiceUID" value="invoiceUIDValue"/>
	<portlet:param name="objectID" value="objectIDValue" />
	<portlet:param name="fileName" value="fileNameValue" />
	<portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>

<portlet:resourceURL var="releaseInvoice" escapeXml="false"
	id="releaseInvoice">
	<portlet:param name="invoiceUID" value="invoiceUIDValue"/>
	<portlet:param name="country" value="countryValue" />
	<portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>

<link rel="stylesheet" type="text/css"
        href="/resource3/common/<%=PropertiesUtil.getCurrentCommonResourceVersion()%>/css/jquery-ui-1.10.2.custom.css">
<!-- move it to headerfooter link rel="stylesheet" type="text/css"
        href="/resource3/common/<%=PropertiesUtil.getCurrentCommonResourceVersion()%>/css/icomoon.min.css"-->
<link rel="stylesheet" type="text/css"
        href="/resource3/common/<%=PropertiesUtil.getCurrentCommonResourceVersion()%>/css/style.min.css">

<!--[if IE 7]>
<link rel="stylesheet" href="/resource3/common/<%=PropertiesUtil.getCurrentCommonResourceVersion()%>/css/icomoon.min.css">
<![endif]-->

<link rel="stylesheet" type="text/css"
	href="/resource3/qtca/<%=PropertiesUtil.getCurrentResourceVersion()%>/css/invoice.css" />
	

<script type="text/javascript" charset="utf-8" language="javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentCommonResourceVersion()%>/js/jquery-ui-1.10.2.custom.min.js"></script>
<script type="text/javascript" charset="utf-8" language="javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentCommonResourceVersion()%>/js/hpui-udk-minify.min.js"></script>
<!-- <script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/common.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/datetimepicker.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.blockUI.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.corner.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.fs.selecter.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.json-2.3.js"></script>                         
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.validate.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/prettify.min.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/underscore.min.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.dataTables.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.dataTables.ext.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/ColVis.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/ColReorderWithResize.js"></script>
<script type="text/javascript" src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/qtca_Gui_Common.js"></script>
 -->

<script type="text/javascript" charset="utf-8">
// for ajax
var ajaxTimePeriodGlobal = '<%=PropertiesWrapperFactory.getInvoiceSearchPropertiesWrapperInstance().getProperty("page.timeout.period", "125000") %>';
var ajaxTimePeriodBatch =  '<%=PropertiesWrapperFactory.getInvoiceSearchPropertiesWrapperInstance().getProperty("page.batch.timeout.period", "125000") %>';
var ajaxNumBatch = '<%=PropertiesWrapperFactory.getInvoiceSearchPropertiesWrapperInstance().getProperty("page.batch.maxnum", "8") %>';
</script>


  <script type="text/javascript" charset="utf-8" bundleuage="javascript"
	src="/resource3/qtca/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/hpui-qtca-minify.min.js"></script>

<!-- <script type="text/javascript" charset="utf-8" bundleuage="javascript"
	src="/resource3/common/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.blockUI.js"></script>
<script type="text/javascript" charset="utf-8" bundleuage="javascript"
	src="/resource3/qtca/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.form.js"></script>
<script type="text/javascript" charset="utf-8" bundleuage="javascript"
	src="/resource3/qtca/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/ColReorder.min.js"></script>
<script type="text/javascript" charset="utf-8" bundleuage="javascript"
	src="/resource3/qtca/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/transaction.js"></script>
<script type="text/javascript" charset="utf-8" bundleuage="javascript"
	src="/resource3/qtca/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/jquery.multiselect.js"></script>
<script type="text/javascript" charset="utf-8" bundleuage="javascript"
	src="/resource3/qtca/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/ColReorderWithResize.js"></script>
<script type="text/javascript" charset="utf-8" bundleuage="javascript"
	src="/resource3/qtca/<%=PropertiesUtil.getCurrentResourceVersion()%>/js/invoice.js"></script> -->

 
 
<input type="hidden" id="contentPath"
	value="<%=request.getContextPath()%>" />
<input type="hidden" id="sessionUserEmail"
	value="<%=UserProfileUtil.getUserEamil(renderRequest)%>" />
<input type="hidden" id="spinnerPath"
	value="<%=PropertiesUtil.getCurrentCommonResourceVersion()%>" />
<input type="hidden" value="${locale}" id="hiddenLocaleForView"/>

<fmt:setLocale value="${locale}"/>
<fmt:setBundle basename="messages" var="bundle"/>

        <%
        String[] invoiceNumber = (String []) request.getAttribute("invoiceNumber");
        String[] searchType = (String []) request.getAttribute("searchType");
        String[] uidNumber = (String []) request.getAttribute("InvoiceUID");
        //String[] uidNumber = (String []) request.getAttribute("UID");
        String[] buinessOperationModel = (String []) request.getAttribute("BuinessOperationModel");
        String[] customerIdCBN = (String []) request.getAttribute("CustomerIdCBN");
        String[] hPSAPOrder = (String []) request.getAttribute("HPSAPOrder");
        String[] invoiceType = (String []) request.getAttribute("InvoiceType");
        String[] invoiceFromDate = (String []) request.getAttribute("InvoiceFromDate");
        String[] invoiceToDate = (String []) request.getAttribute("InvoiceToDate");


        String sinvoiceNumber ="",type="",suidNumber="",sbuinessOperationModel="",scustomerIdCBN="",shPSAPOrder="",sinvoiceType="",sinvoiceFromDate="",sinvoiceToDate="";
       	if(!(searchType != null && searchType.length >=1)){
			type = "";
		}else{
		    type = ((String []) request.getAttribute("searchType"))[0];
		}
		if(!(invoiceNumber != null && invoiceNumber.length >=1)){
			sinvoiceNumber = "";
		}else{
		    sinvoiceNumber = ((String []) request.getAttribute("invoiceNumber"))[0];
		}
		if(!(uidNumber != null && uidNumber.length >=1)){
			suidNumber = ""; 
		}else{
		   suidNumber = ((String []) request.getAttribute("InvoiceUID"))[0];
		}
		if(!(buinessOperationModel != null && buinessOperationModel.length >=1)){
			sbuinessOperationModel = "";
		}else{
		    sbuinessOperationModel = ((String []) request.getAttribute("BuinessOperationModel"))[0];
		}
		if(!(customerIdCBN != null && customerIdCBN.length >=1)){
			scustomerIdCBN = "";
		}else{
		    scustomerIdCBN = ((String []) request.getAttribute("CustomerIdCBN"))[0];
		}
		if(!(hPSAPOrder != null && hPSAPOrder.length >=1)){
			shPSAPOrder = "";
		}else{
		    shPSAPOrder = ((String []) request.getAttribute("HPSAPOrder"))[0];
		}
		if(!(invoiceType != null && invoiceType.length >=1)){
			sinvoiceType = "";
		}else{
		    sinvoiceType = ((String []) request.getAttribute("InvoiceType"))[0];
		}
		if(!(invoiceFromDate != null && invoiceFromDate.length >=1)){
			sinvoiceFromDate = "";
		}else{
		    sinvoiceFromDate = ((String []) request.getAttribute("InvoiceFromDate"))[0];
		}
		if(!(invoiceToDate != null && invoiceToDate.length >=1)){
			sinvoiceToDate = "";
		}else{
		    sinvoiceToDate = ((String []) request.getAttribute("InvoiceToDate"))[0];
		}


    %>
    <input type="hidden" id="hiddenSearchType" value="<%=type%>"/>
    <input type="hidden" id="hiddenInvoiceNumber" value="<%=sinvoiceNumber%>"/>
    <input type="hidden" id="hiddenUIDNumber" value="<%=suidNumber%>"/>
    <input type="hidden" id="hiddenBuinessOperationModel" value="<%=sbuinessOperationModel%>"/>
    <input type="hidden" id="hiddenCustomerIdCBN" value="<%=scustomerIdCBN%>"/>
    <input type="hidden" id="hiddenHPSAPOrder" value="<%=shPSAPOrder%>"/>
    <input type="hidden" id="hiddenInvoiceType" value="<%=sinvoiceType%>"/>
    <input type="hidden" id="hiddenInvoiceFromDate" value="<%=sinvoiceFromDate%>"/>
    <input type="hidden" id="hiddenInvoiceToDate" value="<%=sinvoiceToDate%>"/>


<div id="alertMessagePop" style="dispaly:none;">
    <div id="alertMessage" class="alert"></div>
</div>




<div class="searchPanel"> 
	 <form id="form">  
	    <fieldset id="fieldset" class="MAIN_FIELDSET">
	        <legend>
	                <i class="icon-minus-sign-alt"></i>
	                <span>Search</span>
	        </legend>

			<div id="searchContent" class=" ui-corner-all searchCriteria searchContent">
					<div id="response_field"></div>
						<div class="searchPanel">
							<table>
									<tr>
										<td align="left"><fmt:message key="invoiceNumber" bundle="${bundle}"></fmt:message></td>
									
										<td align="left"><fmt:message key="invoiceState" bundle="${bundle}"></fmt:message></td>
						
										<td align="left"><fmt:message key="customerIdCbn" bundle="${bundle}"></fmt:message></td>
						
										<td align="left"><fmt:message key="customerName" bundle="${bundle}"></fmt:message></td>
										<td align="left"><fmt:message key="hpSapOrderNumber" bundle="${bundle}"></fmt:message></td>
					
										<td align="left"><fmt:message key="poNumber" bundle="${bundle}"></fmt:message></td>
						
						
									</tr>
					
									<tr>
										<td align="left">
											<input id="invid" type="text" name="invid" class="searchCriteria"/>	
										</td>
					
						
										<td align="left">
											<label class="FormLabels"> 
											<!-- <table style="margin-left: 35%;">  -->   
												<select class="FormSelection searchSelection searchCriteria orgSelect" id="state" name="state" >
												<!-- 	<option value="">All</option>
													<option value="ARCHIVED_ACKNOWLEDGED_AND_DONE" title="ARCHIVED_ACKNOWLEDGED_AND_DONE">ARCHIVED_ACKNOWLEDGED_AND_DONE</option>
													<option value="ARCHIVED_AND_DONE" title="ARCHIVED_AND_DONE">ARCHIVED_AND_DONE</option>
													<option value="AWAITING_BATCH_SCHEDULE" title="AWAITING_BATCH_SCHEDULE">AWAITING_BATCH_SCHEDULE</option>
													<option value="AWAITING_MANUAL_INTERVENTION" title="AWAITING_MANUAL_INTERVENTION">AWAITING_MANUAL_INTERVENTION</option>
													<option value="CANCELLED" title="CANCELLED">CANCELLED</option>
													<option value="ERROR" title="ERROR">ERROR</option>
													<option value="GENERATED_ON_ERP" title="GENERATED_ON_ERP">GENERATED_ON_ERP</option>
													<option value="PURGED" title="PURGED">PURGED</option>
													<option value="RECEIVED_FROM_ERP" title="RECEIVED_FROM_ERP">RECEIVED_FROM_ERP</option>
													<option value="RETRY" title="RETRY">RETRY</option>
													<option value="SENT_FROM_ERP" title="SENT_FROM_ERP">SENT_FROM_ERP</option>
													<option value="TRANSMITTED" title="TRANSMITTED">TRANSMITTED</option>
													<option value="UNDER_PROCESSING" title="UNDER_PROCESSING">UNDER_PROCESSING</option> -->
												</select>
											<!-- </table> -->
											</label>	
										</td>
						
										<td align="left">
											<input id="custid" name="custid" type="text" class="searchCriteria"/>	
										</td>
						
										<td align="left">
											<input id="custnm" name="custnm" type="text" class="searchCriteria"/>
										</td>
										<td align="left"><input id="hporder" name="hporder" type="text" class="searchCriteria"/></td>
					
										<td align="left"><input id="custpo" name="custpo" type="text"class="searchCriteria"/></td>
						
									</tr>
					
									<tr>
										<td align="left"><fmt:message key="invoiceFromDate" bundle="${bundle}"></fmt:message></td>
						
										<td align="left"><fmt:message key="invoiceToDate" bundle="${bundle}"></fmt:message></td>
						
										<td align="left"><fmt:message key="batchID" bundle="${bundle}"></fmt:message></td>
						
										<td align="left"><fmt:message key="transmissionFromDate" bundle="${bundle}"></fmt:message></td>
						
										<td align="left" colspan="2"><fmt:message key="transmissionTODate" bundle="${bundle}"></fmt:message></td>
						
									</tr>
					
									<tr>
											<td align="left"><input id="fromDate" name="fromDate" type="text"
												class="searchCriteria">
											</td>
											
											<td align="left"><input id="toDate" name="toDate" type="text"
												class="searchCriteria">
											</td>
											
											<td align="left"><input id="batchid" name="batchid" type="text"
												class="searchCriteria"/>	
											</td>
											
											<td align="left"><input id="transmissionFromDate" name="transmissionFromDate" type="text"
												class="searchCriteria">
												</td>
											
											<td align="left" ><input id="transmissionTODate" name="transmissionTODate" type="text"
												class="searchCriteria">	
												</td>
											
												<td >
												
												<input class="cstmeinput" type="checkbox" id="abnormalties" name="abnormalties"  />
												<label for="abnormalties"><span></span><fmt:message key="abnormalties" bundle="${bundle}"></fmt:message></label>
												
												
											</td>		
									</tr>
					
					
									<tr>
										<td align="left"><fmt:message key="businessOperationModel" bundle="${bundle}"></fmt:message></td>
										
										<td align="left"><fmt:message key="invoiceType" bundle="${bundle}"></fmt:message></td>
										<td align="left">Invoice To Country</td>
										<td align="left">Sold To Country</td>
										<td align="left">Ship To Country</td>								
										<td align="left">Local Country Invoice #</td>
													
									</tr>
									<tr>
									<td align="left"><select class="searchSelection businessOperSlct orgSelect" id="businessOperSlct" name="busopmodl">
												<option value="">ALL</option>
											</select>
											
									</td>
									
									<td align="left"><select class="searchSelection incoiveTypeSlct orgSelect" id="incoiveTypeSlct" name="invtp">
											<option value="">ALL</option>
										</select>
									</td>
									<td align="left">
											<select class="searchSelection countrySlct orgSelect" id="invtocountrycd" name="invtocountrycd"  multiple="multiple">
												<option value="" selected=true >All</option>
											</select>
									</td>								
									<td align="left">
											<select class="searchSelection soldtocountrySlct orgSelect" id="soldtocountrycd" name="soldtocountrycd"  multiple="multiple">
												<option value="" selected=true >All</option>
											</select>
									</td>
									<td align="left">
											<select class="searchSelection shiptocountrySlct orgSelect" id="shiptocountrycd" name="shiptocountrycd"  multiple="multiple">
												<option value="" selected=true >All</option>
											</select>
									</td>
									<td align="left">
											<input id="localcountryinvno" name="localcountryinvno" type="text" class="searchCriteria">	
									</td>
									
									
									
								</tr>
								<tr>
									<td align="left">
										
										<fmt:message key="ReceiveFromDate" bundle="${bundle}"></fmt:message>
									</td>
									<td align="left">
										
										<fmt:message key="ReceiveToDate" bundle="${bundle}"></fmt:message>
									</td>
									<td align="left">Source System</td>
									<td align="left">Company Code</td>
									<td align="left">Idoc#</td>	
									<td align="left">InvoiceUID</td>	
								</tr>
								<tr>
									<td align="left">
										<input id="ReceiveFromDate" class="searchCriteria" type="text" name="ReceiveFromDate">
									</td>
									<td align="left">				
										<input id="ReceiveToDate" class="searchCriteria" type="text" name="ReceiveToDate">
									</td>
									<td align="left">
										<input id="invsrc" class="searchCriteria" type="text" name="invsrc">
									</td>
									<td align="left">				
										<input id="companyCode" class="searchCriteria" type="text" name="companyCode">
									</td>
									<td align="left">
										<input id="idocnum" class="searchCriteria" type="text" name="idocnum">
									</td>
									<td align="left">
										<input id="invoiceUID" class="searchCriteria" type="text" name="invoiceUID">
									</td>
									
								</tr>
								<tr>
								<td colspan="6">
										<div class="controllerButtons"  align="right">
												
<!-- 												<a class="btn btn-upload uploadButton" id="uploadBtn" href="#"><i class="icon-book"></i>Upload</a>		 -->										
												<a class="btn btn-Export downloadCsv" id="exportCSVButton" href="#" style="display:none;" title="<fmt:message key="exportCSVTitle" bundle="${bundle}"></fmt:message>"><i class="icon-external-link "></i><fmt:message key="exportCSVButton" bundle="${bundle}"></fmt:message></a>
												<a class="btn btn-refresh resetFilters" id="resetFilters" href="#"><i class="icon-refresh"></i><fmt:message key="resetFilters" bundle="${bundle}"></fmt:message></a>
												<a class="btn btn-search searchButton" id="searchBtn" href="#"><i class="icon-search"></i><fmt:message key="searchButton" bundle="${bundle}"></fmt:message></a>	
																							
										</div>	
									</td>
								</tr>
							</table>
						</div>		
					</div>				
		
		</fieldset>
	</form>	
</div>		


<div id="displayMessage" align="right" class="displayMessage messageDiv"></div>		

<div>
	<div class="menuTools_Div" id="menuTools_Div">
		<input type='button' class='cancelBatchInvoice' id='cancelBatch' value="<fmt:message key="cancelBatch" bundle="${bundle}"></fmt:message>"/>
		<input type='button' class='flushBatchInvoice' id='flushBatch' value="<fmt:message key="flushBatch" bundle="${bundle}"></fmt:message>"/>	
		<div id="showHideDiv" class="showOrHide"></div>
		<div id="customerFilter" class="customerFilter"></div>	
		<div id="filterInput" class="filterInput"></div>
		<div id="filterIcon" class="filterIcon" style="display:none;" title="<fmt:message key="searchLabelForTable" bundle="${bundle}"></fmt:message>"></div>
	</div>
</div>

<div id="result_table"></div>

<div id="applyAdminDiv" class="applyAdminDiv" style="display:none;"></div>
<div id="invoicePopupDiv" title="<fmt:message key="viewAndDownloadTitle" bundle="${bundle}"></fmt:message>"  style="display:none;"></div>

<div id="uploadPopupDiv" title="Upload attachment"  style="display:none;">

	<form action="${uploadAttachmentData}" method="post"
			enctype="multipart/form-data" id="uploadAttachmentForm">
	<input id="attachment_upload" type="file" style="visibility:hidden;" name="file">
	<label style="margin-left: -230px;">Choose file:</label>
	<div class="input-append">
		<div id="UploadAttachmentObjectID" style="display:none;"></div>
		<div id="UploadAttachmentFileName" style="display:none;"></div>
		<input id="subAttachment" class="input-xlarge" type="text" disabled="disabled">
		<a id="browseAttachmentBtn" class="btn btn-Primary" title="Choose attachment to upload" onclick="$('#attachment_upload').click();">Browse</a>
		<div id="errMsg" style="display:none;"></div>
		<div id="uploadButtons">
		<a id="uploadAttachmentBtn" class="btn btn-Primary" title="Upload attachment" >Upload</a>
		<a id="deleteAttachmentBtn" class="btn btn-Primary" title="Delete attachment" >Delete</a>
		<a id="releaseAttachmentBtn" class="btn btn-Primary" title="Release invoice to TRANSMITTED_TO_EVENDOR" >Release</a>
		</div>

	</div>
	</form>
</div>

<div id="showReprocessMesg" title="View result"  style="display:none;"></div>
<div id="copyInvoiceDiv" title="Copy invoice"  style="display:none;">
	<div>
		<div>Please select target environment</div>
		<div style="margin-top:10px;" id="copyToTargetSelect"></div>
		<div style="margin-top:20px">Are you sure you want to proceed?</div>
	</div>
	<div style="margin-top:20px;margin-left:200px">
		<a class="btn btn-Primary copyInvoiceBtn" href="#">Yes</a>
		<a class="btn btn-Primary btn-no" href="#">No</a>	
	</div>
</div>

<div id="invoiceHistoryPopupDiv" title="<fmt:message key="viewHistoryTitle" bundle="${bundle}"></fmt:message>"  style="display:none;">
	<div>
		<table id="radioViewHistory" border="0px;">
			<tr align="left">
				<td>
					<input type="radio" class="historyRadionButton cstmeinput" name="viewStyle" id="defaultView" value="default" >
					<label for="defaultView"><span></span><fmt:message key="businessView" bundle="${bundle}"></fmt:message></label>
					<div class='selectFilterType' title='Filter the type column'>
						<select name='filterStateList' multiple='multiple' class='historyStateDropdown'>
						</select>
					</div>
					<input type="radio" class="historyRadionButton cstmeinput" name="viewStyle" id="technicalView" value="technical">
					<label for="technicalView"><span></span><fmt:message key="technicalView" bundle="${bundle}"></fmt:message></label>
				</td>
			</tr>
		</table>
	</div>
	<div id="displayHistoryMessage" align="right"></div>
	<div id="historyNiceViewTable"></div>
	<div id="historyTechnicalView"></div>
</div>
<div id="checkPassDuplicateInvoiceDiv" title="<fmt:message key="duplicateCheckTitle" bundle="${bundle}"></fmt:message>" style="display:none;">
	<div id="displayCheckPassMessage" align="right">
	</div><input type="hidden" id="passCheckInvoiceUID"/>
	<label class="checkPassParagraph" align="left"><fmt:message key="duplicateCheckComment1" bundle="${bundle}"></fmt:message> <span id="currentStatus"></span>.<br/><br/>
		<fmt:message key="duplicateCheckComment2" bundle="${bundle}"></fmt:message> <a href="#" value="on" class="checkPassInvoice"><fmt:message key="duplicateCheckComment3" bundle="${bundle}"></fmt:message></a> <fmt:message key="duplicateCheckComment4" bundle="${bundle}"></fmt:message> <a href="#" value="off" class="checkPassInvoice"><fmt:message key="duplicateCheckComment5" bundle="${bundle}"></fmt:message></a> <fmt:message key="duplicateCheckComment6" bundle="${bundle}"></fmt:message>.
		<br/><br/><fmt:message key="duplicateCheckComment7" bundle="${bundle}"></fmt:message><br/><fmt:message key="duplicateCheckComment8" bundle="${bundle}"></fmt:message>
	</label>
</div>
<div id="dialog-confirm-reprocess" title="<fmt:message key="reprocessConfirmTitle" bundle="${bundle}"></fmt:message>" style="display:none;">
		
    <p style="font-size:16px;"><fmt:message key="reprocessConfirmBody" bundle="${bundle}"></fmt:message></p>    
    <p style="margin-left:20px;margin-top:20px;">
    	<input class="cstmeinput" type="radio" id="r1" name="rr" value="copy" checked/>
		<label for="r1"><span></span>Reprocess as copy of original </label>
	</p>
    <p style="margin-left:20px;margin-top:15px;">
    	<input class="cstmeinput" type="radio" id="r2" name="rr" value="original" />
		<label for="r2"><span></span>Reprocess as original </label>
    </p>	
	<p></p>	    
</div>

<div id="dialog-confirm-reprocess-two" title="<fmt:message key="reprocessConfirmTitle" bundle="${bundle}"></fmt:message>" style="display:none;">
	<p style="color: red; margin-left: 20px;font-size:12px;">
    	Due to tax regulations, an original invoice is just allowed to be sent once to the customer. You must ensure you have written tax department approval, once proceeding. By pressing "Yes",you confirm, that tax department agreed on the reprocessing as original. Please note, that your name will be tracked in the invoice history. 
    </p>
   <br>
   <p style="margin-left:20px;display:none;font-size:16px;" id="original">
    	Are you sure you want to reprocess the invoice(s) as 
			 <font style="color:red;">original</font>	?
   </p>   
   <p style="margin-left:20px;display:none;font-size:16px;" id="copy">
    	Are you sure you want to reprocess the invoice(s) as	
    	<font style="color:red;"> copy of original</font>	?	
   </p>   	
	<p></p>	
</div>

<div id="dialog-confirm-cancel" title="<fmt:message key="cancelConfirmTitle" bundle="${bundle}"></fmt:message>" style="display:none;">
    <p><span class="ui-icon ui-icon-alert"></span><fmt:message key="cancelConfirmBody" bundle="${bundle}"></fmt:message></p>
</div>

<div id="uploadDialog" title="upload the invoice numbers" style="display:none;">
	<input id="file_upload" type="file" style="visibility:hidden;" name="file">
	<label style="margin-left: -230px;">Choose file:</label>
	<div class="input-append">
		<input id="subfile" class="input-xlarge" type="text" disabled="disabled">
		<a id="browseBtn" class="btn btn-Primary" title="Choose setup file to upload" onclick="$('#file_upload').click();">Browse</a>
		<a id="reprocessBtn" class="btn btn-Primary" title="Bulk Reprocess" >Reprocess</a>
	</div>
</div>


		
	

<div id="actionDiv" class="actionDiv" style="dispaly:none;">
	<input type="hidden" id="actionDiv_InvoiceUID"/>
	<input type="hidden" id="actionDiv_InvoiceToCountry"/>
	<div id="actionDiv_actionList" class="actionList">
		
	</div>
</div>
<form id="exportCSVForm" method="post" action="${exportCsvFile}" style="display:none;">
	<input id="csvContents" name = "csvContents" type="hidden"/>
</form>

<div id="hidebundleuage" style="display:none;">
	<input type="hidden" id="actionHeader" value="<fmt:message key="actionHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="invoiceNumberHeader" value="<fmt:message key="invoiceNumberHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="invoiceDateHeader" value="<fmt:message key="invoiceDateHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="invoiceReceivedDateHeader" value="<fmt:message key="invoiceReceivedDateHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="invoiceStateHeader" value="<fmt:message key="invoiceStateHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="batchIdHeader" value="<fmt:message key="batchID" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="transmissionDate" value="<fmt:message key="transmissionDate" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="transmissionFromDate" value="<fmt:message key="transmissionFromDate" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="transmissionTODate" value="<fmt:message key="transmissionTODate" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="ReceiveFromDate" value="<fmt:message key="ReceiveFromDate" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="ReceiveToDate" value="<fmt:message key="ReceiveToDate" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="customerIdHeader" value="<fmt:message key="customerIdHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="reviewEvents" value="<fmt:message key="revieweventsHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="customerPoNumberHeader" value="<fmt:message key="customerPoNumberHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="customerNameHeader" value="<fmt:message key="customerNameHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="hpSapOrderNumberHeader" value="<fmt:message key="hpSapOrderNumberHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="totalPaymentDueDateHeader" value="<fmt:message key="totalPaymentDueDateHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="totalAmountHeader" value="<fmt:message key="totalAmountHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="currencyHeader" value="<fmt:message key="currencyHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noDateCanBeReceived" value="<fmt:message key="noDateCanBeReceived" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="searchResultMessageComment1" value="<fmt:message key="searchResultMessageComment1" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="searchResultMessageComment2" value="<fmt:message key="searchResultMessageComment2" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="exceptionInJs" value="<fmt:message key="exceptionInJs" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="dataServiceNotAvailable" value="<fmt:message key="dataServiceNotAvailable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewHistoryTitle" value="<fmt:message key="viewHistoryTitle" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewHistoryDate" value="<fmt:message key="viewHistoryDate" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewHistoryType" value="<fmt:message key="viewHistoryType" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewHistoryInvoiceUID" value="<fmt:message key="viewHistoryInvoiceUID" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewHistoryState" value="<fmt:message key="viewHistoryState" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewHistoryEvent" value="<fmt:message key="viewHistoryEvent" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewHistoryDescription" value="<fmt:message key="viewHistoryDescription" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noHistoryFound" value="<fmt:message key="noHistoryFound" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="duplicateCheckIconTitle" value="<fmt:message key="duplicateCheckIconTitle" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="currentStatusOn" value="<fmt:message key="currentStatusOn" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="currentStatusOff" value="<fmt:message key="currentStatusOff" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="currentStatusOnAndOff" value="<fmt:message key="currentStatusOnAndOff" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="serviceNotAvailableInPassCheck" value="<fmt:message key="serviceNotAvailableInPassCheck" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="turnDuplicateCheckResponseComment1" value="<fmt:message key="turnDuplicateCheckResponseComment1" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="turnDuplicateCheckResponseComment2" value="<fmt:message key="turnDuplicateCheckResponseComment2" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noDuplicateCheckStatusReturned" value="<fmt:message key="noDuplicateCheckStatusReturned" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="reprocessIconTitle" value="<fmt:message key="reprocessIconTitle" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noResponseInReprocess" value="<fmt:message key="noResponseInReprocess" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="serviceNotAvailableInReprocess" value="<fmt:message key="serviceNotAvailableInReprocess" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="dataServiceIsNotAvailableInReprocess" value="<fmt:message key="dataServiceIsNotAvailableInReprocess" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noRecordToExport" value="<fmt:message key="noRecordToExport" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewAndDownloadLinkTitle" value="<fmt:message key="viewAndDownloadLinkTitle" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noDateReceived" value="<fmt:message key="noDateReceived" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noResultForViewDownload" value="<fmt:message key="noResultForViewDownload" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewTitle" value="<fmt:message key="viewTitle" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="downloadTitle" value="<fmt:message key="downloadTitle" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="viewLabel" value="<fmt:message key="viewLabel" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="downloadLabel" value="<fmt:message key="downloadLabel" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="sureAction" value="<fmt:message key="sureAction" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="cancelAction" value="<fmt:message key="cancelAction" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="cancelBatch" value="<fmt:message key="cancelBatch" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="flushBatch" value="<fmt:message key="flushBatch" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="applyAdmin" value="<fmt:message key="applyAdmin" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="businessOperationModelHeader" value="<fmt:message key="businessOperationModelHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="invoiceTypeHeader" value="<fmt:message key="invoiceTypeHeader" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="batchReprocessInvoice" value="<fmt:message key="batchReprocessInvoice" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="successfullyReprocessed" value="<fmt:message key="successfullyReprocessed" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noRecordReprocessed" value="<fmt:message key="noRecordReprocessed" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noResponseInCancel" value="<fmt:message key="noResponseInCancel" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="batchCancelInvoice" value="<fmt:message key="batchCancelInvoice" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noRecordCanceled" value="<fmt:message key="noRecordCanceled" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="successfullyCanceled" value="<fmt:message key="successfullyCanceled" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="lengthMenuForTable" value="<fmt:message key="lengthMenuForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="searchLabelForTable" value="<fmt:message key="searchLabelForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="showHideLabelForTable" value="<fmt:message key="showHideLabelForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="informationForTable" value="<fmt:message key="informationForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="firstPageForTable" value="<fmt:message key="firstPageForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="lastPageForTable" value="<fmt:message key="lastPageForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="nextPageForTable" value="<fmt:message key="nextPageForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="previousPageForTable" value="<fmt:message key="previousPageForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="zeroRecordsForTable" value="<fmt:message key="zeroRecordsForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="infoEmptyForTable" value="<fmt:message key="infoEmptyForTable" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noneSelectedText" value="<fmt:message key="noneSelectedText" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noPermissionToViewMessage" value="<fmt:message key="authorization.html.warning.noPermissionToView" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noPermissionToDownloadMessage" value="<fmt:message key="authorization.html.warning.noPermissionToDownload" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noPermissionToViewHistory" value="<fmt:message key="authorization.html.warning.noPermissionToViewHistory" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noPermissionToReprocessMessage" value="<fmt:message key="authorization.html.warning.noPermissionToReprocess" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noPermissionToBypassCheckMessage" value="<fmt:message key="authorization.html.warning.noPermissionToBypassCheck" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noPermissionToExportMessage" value="<fmt:message key="authorization.html.warning.noPermissionToExport" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="noPermissionToCancel" value="<fmt:message key="authorization.html.warning.noPermissionToCancel" bundle="${bundle}"></fmt:message>"/>
	<input type="hidden" id="requestTimeOutMeg_input" value="<fmt:message key="error.request.timeout" bundle="${bundle}"></fmt:message>"/>
</div>
<script type="text/javascript" charset="utf-8">
	var adminurl = '<%=PropertiesUtil.getRequestAccessUrl()%>';
	var currentEnv = '<%=PropertiesUtil.getCurrentEnvironment()%>';
var filterPrefixedDoc = '<%=PropertiesWrapperFactory.getInvoiceSearchPropertiesWrapperInstance().getProperty("filterPrefixedDoc", "yes") %>';

var checkProtocted = <%=com.hp.it.qtca.url.uitl.PropertiesUtil.isProtected() %>;
var isSupperUser = <%=com.hp.it.qtca.url.uitl.PropertiesUtil.isSuperGroup(renderRequest)%>;
// var businessOperationModelStr = '<%=PropertiesWrapperFactory.getInvoiceSearchPropertiesWrapperInstance().getProperty("businessOperationModel.list", "ALL") %>';
var businessOperationModelStr = '<%=renderRequest.getAttribute("omgs")%>'; 
var invoiceStatesStr = '<%=renderRequest.getAttribute("invoiceStates")%>';
var incoiveTypeStr = '<%=PropertiesWrapperFactory.getInvoiceSearchPropertiesWrapperInstance().getProperty("invoiceType.list", "ALL") %>';
var currentCommonVersion = '<%=PropertiesUtil.getCurrentCommonResourceVersion()%>';
var currentResourceVersion = '<%=PropertiesUtil.getCurrentResourceVersion()%>';
var viewAuthority = <%=ACUtil.hasPermission("com.hp.it.qtca",0)%>;	
var historyAuthority = <%=ACUtil.hasPermission("com.hp.it.qtca",2)%>;
var duplicateCheckAuthority = <%=ACUtil.hasPermission("com.hp.it.qtca",3)%>;
var reprocessAuthority = <%=ACUtil.hasPermission("com.hp.it.qtca",4)%>;		
var cancelAuthority = <%=ACUtil.hasPermission("com.hp.it.qtca",5)%>;
var resumeAuthority = <%=ACUtil.hasPermission("com.hp.it.qtca",6)%>;
var copyAuthority = <%=ACUtil.hasPermission("com.hp.it.qtca",19)%>;
var requestTimeOutMeg = document.getElementById('requestTimeOutMeg_input').value;
	(function($) {
		this.getPortletUrl = function() {
			var JSonUrl = '${resourceUrl}';
			return JSonUrl;
		};
		this.getViewAndDownPortletUrl = function() {
			var JSonUrl = '${viewDownloadURL}';
			return JSonUrl;
		};
		// this.getOperateAuthorization = function() {
		// 	var JSonUrl = '${checkIfOperationAuthorized}';
		// 	return JSonUrl;
		// };
		// this.getAllAuthorizedOperate = function() {
		// 	var JSonUrl = '${getAuthorizedOperations}';
		// 	return JSonUrl;
		// };
		this.applyAdminEmail = function() {
			var JSonUrl = '${sendEmail}';
			return JSonUrl;
		};
		this.getCopyInvoiceUrl = function() {
			var JSonUrl = '${copyInvoices}';
			return JSonUrl;
		};
		this.getUploadInvoiceAttachmentUrl = function() {
			var JSonUrl = '${uploadAttachmentData}';
			return JSonUrl;
		};
		this.getDeleteInvoiceAttachmentUrl = function() {
			var JSonUrl = '${deleteAttachmentData}';
			return JSonUrl;
		};
		
		this.getReleaseInvoiceUrl=function() {
			var JSonUrl = '${releaseInvoice}';
			return JSonUrl;
		};
		
	})(jQuery);
</script>

