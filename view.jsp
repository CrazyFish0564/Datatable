<%@page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@page import="com.hp.it.documentgeneration.utils.PropertiesUtil"%>
<%@page import="com.hp.it.qtca.url.uitl.SecurityUtil" %>
<%@page import="com.hp.it.qtca.auth.UserProfileUtil"%>
<%@page import="com.hp.it.documentgeneration.controller.DocumentGenerationController" %>

<portlet:defineObjects />
<portlet:resourceURL var="searchDocumentGeneration" escapeXml="false" id="searchDocumentGeneration">
    <portlet:param name="searchCriteria" value="paramValue" />
    <portlet:param name="tenant" value="tenantRbValue" />
    <portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>

<portlet:resourceURL var="searchDocumentGenerationByDocId" escapeXml="false" id="searchDocumentGenerationByDocId">
    <portlet:param name="ddsDocId" value="paramValue" />
    <portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>

<portlet:resourceURL var="searchHistoryInfoById" escapeXml="false" id="searchHistoryInfoById">
    <portlet:param name="objectId" value="paramValue" />
    <portlet:param name="tenant" value="tenantId" />
    <portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>

<portlet:resourceURL var="retriggerDocument" escapeXml="false" id="retriggerDocument">
    <portlet:param name="docType" value="docTypeValue" />
    <portlet:param name="sourceSystem" value="sourceSystemValue" />
    <portlet:param name="qtcaDocId" value="qtcaDocIdValue" />
    <portlet:param name="tenant" value="tenantIdValue" />
    <portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>

<portlet:resourceURL var="searchRevisionsByUID" escapeXml="false" id="searchRevisionsByUID">
    <portlet:param name="uID" value="paramValue" />
    <portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>
<portlet:resourceURL var="viewDownload" escapeXml="false" id="viewDownload">
    <portlet:param name="uri" value="uriValue" />
    <portlet:param name="predicate" value="predicateValue" />
    <portlet:param name="viewDownloadFlag" value="flagValue" />
    <portlet:param name="token" value="<%=SecurityUtil.getAntiToken(renderRequest)%>"/>
</portlet:resourceURL>

<%  String commonVersion = PropertiesUtil.getCurrentCommonResourceVersion();%>
<%  String resourceVersion = PropertiesUtil.getCurrentResourceVersion(); %>

 

<link type="text/css" rel="stylesheet" href="/resource3/common/<%=commonVersion%>/css/jquery-ui-1.10.2.custom.css" />
<link type="text/css" rel="stylesheet" href="/resource3/common/<%=commonVersion%>/css/style.css" />
<link type="text/css" rel="stylesheet" href="/resource3/documentGeneration/<%=resourceVersion%>/css/documentGeneration.css" />


<script type="text/javascript" src="/resource3/common/<%=commonVersion%>/js/jquery-ui-1.10.2.custom.js"></script>
<script type="text/javascript" charset="utf-8" language="javascript" src="/resource3/common/<%=commonVersion%>/js/hpui-udk-minify.min.js"></script>
<script type="text/javascript" charset="utf-8" src="/resource3/documentGeneration/<%=resourceVersion%>/js/jquery.multiselect.min.js"></script>
<script type="text/javascript" charset="utf-8" src="/resource3/documentGeneration/<%=resourceVersion%>/js/documentGeneration.js"></script>


<input type="hidden" id="hiddenCommonVersion" value="<%=commonVersion%>"/>
<input type="hidden" id="hiddenresourceVersion" value="<%=resourceVersion%>"/>

<input type="hidden" id="contentPath" value="<%=request.getContextPath()%>" />
<input type="hidden" id="sessionUserEmail" value="<%=UserProfileUtil.getUserEamil(renderRequest)%>" />
<input type="hidden" id="spinnerPath" value="<%=PropertiesUtil.getCurrentCommonResourceVersion()%>" />
<input type="hidden" value="${locale}" id="hiddenLocaleForView"/>

<fmt:setLocale value="${locale}"/>
<fmt:setBundle basename="messages" var="bundle"/>

        <%        
        String[] searchType = (String []) request.getAttribute("searchType");
        String[] ddsDocID = (String []) request.getAttribute("ddsDocID");
        String[] sourceDocID = (String []) request.getAttribute("sourceDocID");
        String[] docStatus = (String []) request.getAttribute("docStatus");
        String[] dateFrom = (String []) request.getAttribute("dateFrom");
        String[] dateTo = (String []) request.getAttribute("dateTo");
        String[] docType = (String []) request.getAttribute("docType");
        String[] originatingSystem = (String []) request.getAttribute("originatingSystem");

        String ssearchType ="",sddsDocID="",ssourceDocID="",sdocStatus="",sdateFrom="",sdateTo="",sdocType="",soriginatingSystem="";
       	if(!(searchType != null && searchType.length >=1)){
       		ssearchType = "";
		}else{
			ssearchType = searchType[0];
		}
		if(!(ddsDocID != null && ddsDocID.length >=1)){
			sddsDocID = "";
		}else{
			sddsDocID = ddsDocID[0];
		}
		if(!(sourceDocID != null && sourceDocID.length >=1)){
			ssourceDocID = ""; 
		}else{
			ssourceDocID = sourceDocID[0];
		}
		if(!(docStatus != null && docStatus.length >=1)){
			sdocStatus = "";
		}else{
			sdocStatus = docStatus[0];
		}
		if(!(dateFrom != null && dateFrom.length >=1)){
			sdateFrom = "";
		}else{
			sdateFrom = dateFrom[0];
		}
		if(!(dateTo != null && dateTo.length >=1)){
			sdateTo = "";
		}else{
			sdateTo = dateTo[0];
		}
		if(!(docType != null && docType.length >=1)){
			sdocType = "";
		}else{
			sdocType = docType[0];
		}
		if(!(originatingSystem != null && originatingSystem.length >=1)){
			soriginatingSystem = "";
		}else{
			soriginatingSystem = originatingSystem[0];
		}
    %>
    <input type="hidden" id="hiddenSearchType" value="<%=ssearchType%>"/>
    <input type="hidden" id="hiddenDdsDocID" value="<%=sddsDocID%>"/>
    <input type="hidden" id="hiddenSourceDocID" value="<%=ssourceDocID%>"/>
    <input type="hidden" id="hiddenDocStatus" value="<%=sdocStatus%>"/>
    <input type="hidden" id="hiddenDateFrom" value="<%=sdateFrom%>"/>
    <input type="hidden" id="hiddenDateTo" value="<%=sdateTo%>"/>
    <input type="hidden" id="hiddenDocType" value="<%=sdocType%>"/>
    <input type="hidden" id="hiddenOriginatingSystem" value="<%=soriginatingSystem%>"/>


<div class="searchPanel" > 
 <form id="documentSearchForm">  
    <fieldset id="" class="MAIN_FIELDSET">
        <legend>
                <i class="icon-minus-sign-alt"></i>
                <span>Search</span>
        </legend>
       
        <table>
                <tbody>
                    <tr>                             
                         <td align="left">QTCA Doc ID
                            <a class="tooltip" href="#"><i class=" icon-question-sign"></i>
                                <span class="custom help">
                                    <div class="tooltip_title"> 
                                        <br>
                                            <i class="icon-exclamation-sign"></i>Unique ID generated by QTCA
                                            <br>
                                            <br>
                                    </div>
                                </span>
                            </a>
                         </td>
                         <td align="left">Source Doc ID 
                            <a class="tooltip" href="#"><i class=" icon-question-sign"></i>
                                <span class="custom help">
                                    <div class="tooltip_title"> 
                                        <br>
                                            <i class="icon-exclamation-sign"></i>Can be saved as a secondary reference
                                            <br>
                                            <br>
                                    </div>
                                </span>
                            </a>
                         </td>
                         <td align="left">Status</td>
                         <td align="left">Date From</td>
                         <td align="left">Date To</td>
                         <td align="left">Document Type</td>
                         
                    </tr>                    
                    <tr>
                         <td><input type="text" class="searchCriteria" name="ddsDocID" id="DDSDocID" value=""/></td> 
                         <td><input type="text" class="searchCriteria" name="SourceDocID" id="SourceDocID"/></td>                   
                         <td>
                            <select id="documentStatus" name="Status" class="orgSelect"></select>
                        </td>
                        <td>
                            <input type="text" class="searchCriteria" id="dateFrom" name="dateFrom" />
                        </td> 
                        <td>
                            <input type="text" class="searchCriteria" id="dateTo" name="dateTo" />
                        </td>
                        <td>
                            <select id="documentType" name="Type" class="orgSelect"></select>
                        </td>
                         
                    </tr>
                    <tr>
                        <td align="left">OriginatingSystem</td>
                    </tr>
                    
                    <tr>
                        <td colspan="1"><select id="documentOriginatingSystem" name="OriginatingSystem" class="orgSelect"></select></td>
						<td class="searchByTenant">
						 <input class="cstmeinput" type="radio" id="tenantRbHP" name="tenantRB" value="HPE" checked="checked"/>
						 <label for="tenantRbHP"><span></span>HPE</label>
						 <input class="cstmeinput" type="radio" id="tenantRbHPQ" name="tenantRB" value="HPQ" />
						 <label for="tenantRbHPQ"><span></span>HPQ</label>
						</td>
                    </tr>
                    <tr>
                        <td colspan="6" class='searchAlignRight'>
                                <div class="controller button controllerButtons">
                                 <a class="btn btn-search searchButton" id="searchBtn" href="#" style="border-top-right-radius: 5px; border-bottom-left-radius: 5px;"><i class="icon-search"></i>Search</a>
                                 <a class="btn btn-refresh resetFilters" id="resetFilters" href="#" style="border-top-right-radius: 5px; border-bottom-left-radius: 5px;"><i class="icon-refresh"></i>Reset</a>
                                </div>
                        </td>
                    </tr>
                </tbody>
        </table>
        
    </fieldset>         
</form>
 </div>  

    <section id="resultSection">
        <!-- <h2><span class="accordion-icon icon-plus"></span>Search Result   -->
        <div align="right" class="displayMessage messageDiv" id="displayMessage"></div>
        <!-- </h2>             -->
        <div id="result_table">
        </div>
    </section>




<div id="actionDiv" class="actionDiv" style="dispaly:none;">
    <ul id="actionDiv_actionList" class="actionList"></ul>    
</div>
<div id="alertMessagePop" style="dispaly:none;">
    <div id="alertMessage" class="alert"></div>
</div>
<div id="viewDownloadDocPop" title="View and download archived document file"  style="display:none;">  
</div>
<div id="documentHistoryPop" title="Document history"  style="display:none;">
    <div>
        <table id="radioViewHistory" border="0px;">
            <tr align="left">
                <td>
                    <input type="radio" class="historyRadionButton cstmeinput" name="viewStyle" id="defaultView" value="default" >
                    <label for="defaultView"><span></span>Business view</label>
                    <div class='selectFilterType' title='Filter the type column'>
                    <select name='filterStateList' multiple='multiple' class='historyStateDropdown'>
                    </select>
                    </div>
                    <input type="radio" class="historyRadionButton cstmeinput" name="viewStyle" id="technicalView" value="technical">
                    <label for="technicalView"><span></span>Technical view</label>
                </td>
            </tr>
         </table>
    </div>
    <div id="displayHistoryMessage" align="right"></div>
    <div id="historyNiceViewTable"></div>
    <div id="historyTechnicalView"></div>
</div>





    

<!--[if IE 8]>
<script type="text/javascript" src="/resource3/common/<%=commonVersion%>/js/jquery.corner.min.js"></script>
<![endif]-->




<script type="text/javascript" charset="utf-8">

    var documentStatusList = '<%=PropertiesUtil.getPropertiesFromConfigFile("document-generation.properties","document.status.list","All")%>';
    var documentTypeList = '<%=PropertiesUtil.getPropertiesFromConfigFile("document-generation.properties","document.type.list","All")%>';
    var documentOriginatingSystemList = '<%=PropertiesUtil.getPropertiesFromConfigFile("document-generation.properties","document.OriginatingSystem.list","All")%>';  
    (function($){
        this.searchDocumentGenerationUrl = function(){
            var JSonUrl = '${searchDocumentGeneration}';
            return JSonUrl;
        };  

        this.searchDocumentGenerationByDocIdUrl = function(){
            var JSonUrl = '${searchDocumentGenerationByDocId}';
            return JSonUrl;
        }; 
        
        this.searchHistoryInfoByIdUrl = function(){
            var JSonUrl = '${searchHistoryInfoById}';
            return JSonUrl;
        };  

        this.retriggerDocumentUrl = function(){
            var JSonUrl = '${retriggerDocument}';
            return JSonUrl;
        };  
        
        this.searchRevisionsByUIDUrl = function(){
            var JSonUrl = '${searchRevisionsByUID}';
            return JSonUrl;
        };
        this.viewDownloadUrl = function(){
            var JSonUrl = '${viewDownload}';
            return JSonUrl;
        };
        

    })(jQuery)
</script>