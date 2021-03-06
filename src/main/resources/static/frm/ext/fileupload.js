jQuery.extend({

			createUploadIframe : function(id, uri) {
				// create frame
				var frameId = 'jUploadFrame' + id;

				/*if (window.ActiveXObject) {
					if (jQuery.browser.version == "9.0"
							|| jQuery.browser.version == "10.0") {
						var io = document.createElement('iframe');
						io.id = frameId;
						io.name = frameId;
					} else if (jQuery.browser.version == "6.0"
							|| jQuery.browser.version == "7.0"
							|| jQuery.browser.version == "8.0") {
						var io = document.createElement('<iframe id="'
								+ frameId + '" name="' + frameId + '" />');
						if (typeof uri == 'boolean') {
							io.src = 'javascript:false';
						} else if (typeof uri == 'string') {
							io.src = uri;
						}
					}
				}*/
				
				if (/msie/.test(navigator.userAgent.toLowerCase())) {
					if ('undefined' == typeof(document.body.style.maxHeight)) {//ie6
						var io = document.createElement('<iframe id="'
								+ frameId + '" name="' + frameId + '" />');
						if (typeof uri == 'boolean') {
							io.src = 'javascript:false';
						} else if (typeof uri == 'string') {
							io.src = uri;
						}
					} else if (!$.support.leadingWhitespace) {//ie6-8
						var io = document.createElement('<iframe id="'
								+ frameId + '" name="' + frameId + '" />');
						if (typeof uri == 'boolean') {
							io.src = 'javascript:false';
						} else if (typeof uri == 'string') {
							io.src = uri;
						}
					} else {
						var io = document.createElement('iframe');
						io.id = frameId;
						io.name = frameId;
					}
				}  else {
					var io = document.createElement('iframe');
					io.id = frameId;
					io.name = frameId;
				}
				io.style.position = 'absolute';
				io.style.top = '-1000px';
				io.style.left = '-1000px';
				
				document.body.appendChild(io);
				return io
			},
			createUploadForm : function(id, fileElementId,data) {
				// create form
				var formId = 'jUploadForm' + id;
				var fileId = 'jUploadFile' + id;
				var form = $('<form  action="" method="POST" name="' + formId
						+ '" id="' + formId
						+ '" enctype="multipart/form-data"></form>');
				var oldElement = $('#' + fileElementId);
				var newElement = $(oldElement).clone();
				$(oldElement).attr('id', fileId);
				$(oldElement).before(newElement);
				$(oldElement).appendTo(form);
				FileUpload.tempId = fileId;
				// set attributes
				$(form).css('position', 'absolute');
				$(form).css('top', '-1200px');
				$(form).css('left', '-1200px');
				$(form).appendTo('body');
				
				if (data) {
					for (var i in data) {  
				        $('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo($(form));  
				    }
				}
				
				return form;
			},

			ajaxFileUpload : function(s) {
				// TODO introduce global settings, allowing the client to modify
				// them for all requests, not only timeout
				s = jQuery.extend({}, jQuery.ajaxSettings, s);
				var id = s.fileElementId;
				var form = jQuery.createUploadForm(id, s.fileElementId, s.data);
				var io = jQuery.createUploadIframe(id, s.secureuri);
				var frameId = 'jUploadFrame' + id;
				var formId = 'jUploadForm' + id;
				// Watch for a new set of requests
				if (s.global && !jQuery.active++) {
					jQuery.event.trigger("ajaxStart");
				}
				var requestDone = false;
				// Create the request object
				var xml = {}
				if (s.global)
					jQuery.event.trigger("ajaxSend", [ xml, s ]);
				// Wait for a response to come back
				var uploadCallback = function(isTimeout) {
					var io = document.getElementById(frameId);
					try {
						if (io.contentWindow) {
							xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML
									: null;
							xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument
									: io.contentWindow.document;

						} else if (io.contentDocument) {
							xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML
									: null;
							xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument
									: io.contentDocument.document;
						}
					} catch (e) {
						jQuery.handleUploadError2(s, xml, null, e);
					}
					if (xml || isTimeout == "timeout") {
						requestDone = true;
						var status;
						try {
							status = isTimeout != "timeout" ? "success"
									: "error";
							// Make sure that the request was successful or
							// notmodified
							if (status != "error") {
								// process the data (runs the xml through
								// httpData regardless of callback)
								var data = jQuery.uploadHttpData(xml,
										s.dataType);
								// If a local callback was specified, fire it
								// and pass it the data
								if (s.success)
									s.success(data, status);

								// Fire the global callback
								if (s.global)
									jQuery.event.trigger("ajaxSuccess", [ xml,
											s ]);
							} else
								jQuery.handleUploadError2(s, xml, status);
						} catch (e) {
							throw e;
							status = "error";
							jQuery.handleUploadError2(s, xml, status, e);
						}

						// The request was completed
						if (s.global)
							jQuery.event.trigger("ajaxComplete", [ xml, s ]);

						// Handle the global AJAX counter
						if (s.global && !--jQuery.active)
							jQuery.event.trigger("ajaxStop");

						// Process result
						if (s.complete)
							s.complete(xml, status);

						jQuery(io).unbind()

						setTimeout(function() {
							try {
								$(io).remove();
								$(form).remove();

							} catch (e) {
								jQuery.handleUploadError2(s, xml, null, e);
							}

						}, 100)

						xml = null

					}
				}
				// Timeout checker
				if (s.timeout > 0) {
					setTimeout(function() {
						// Check to see if the request is still happening
						if (!requestDone)
							uploadCallback("timeout");
					}, s.timeout);
				}
				try {
					// var io = $('#' + frameId);
					var form = $('#' + formId);
					$(form).attr('action', s.url);
					$(form).attr('method', 'POST');
					$(form).attr('target', frameId);
					if (form.encoding) {
						form.encoding = 'multipart/form-data';
					} else {
						form.enctype = 'multipart/form-data';
					}
					$(form).find("input[type='file']").each(function(index,elem){
						if(!$(elem).attr("name")) $(elem).attr("name","uploadfile");
					});
					$(form).submit();

				} catch (e) {
					jQuery.handleUploadError2(s, xml, null, e);
				}
				if (window.attachEvent) {
					document.getElementById(frameId).attachEvent('onload',
							uploadCallback);
				} else {
					document.getElementById(frameId).addEventListener('load',
							uploadCallback, false);
				}
				return {
					abort : function() {
					}
				};

			},

			uploadHttpData : function(r, type) {
				var data = !type;
				data = type == "xml" || data ? r.responseXML : r.responseText;
				// If the type is "script", eval it in global context
				if (type == "script")
					jQuery.globalEval(data);
				// Get the JavaScript object, if JSON is used.
				if (type == "json"){
					try{
						eval("data = " + data);
					}catch(e){
						data = jQuery.parseJSON(jQuery(data).text());
					}
				}
					
				// evaluate scripts within html
				if (type == "html")
					jQuery("<div>").html(data).evalScripts();
				return data;
			}
		})


/**
 * 上传文件
 */
var FileUpload = {
	/*tempId : null,
	upload : function(fileDomId, method, params, successCallback,failedCallbackpa) {
		if (!successCallback)
			successCallback = function(data) {
			};
		if (!failedCallbackpa)
			failedCallbackpa = function(data) {
				alert("上传失败");
			};
		
		var resetFileDom = function(){
//			var fileId = FileUpload.tempId;
//			if(!fileId) return;
//			$("#"+fileDomId).after($("#"+fileId));
//			$("#"+fileDomId).remove();
//			$("#"+fileId).attr("id",fileDomId);
//			FileUpload.tempId = null;
		};
			
		var failedCallback = function(data, status, e){
			resetFileDom();
			failedCallbackpa(data, status, e);
		} ;
			
		if (!params)
			params = {};
		var path = '';
		if(typeof(contextPath) != "undefined") path = contextPath;
		var urlPar = "";
		if(params.noftp) {
			//urlPar = "?noftp=1";
			urlPar = "?uploadType=1&mm=5";
		}
		jQuery.handleUploadError2 = failedCallback;
		$.ajaxFileUpload({
			url : path + '/servlet/InfoUploadServlet'+urlPar,
			secureuri : false,
			fileElementId : fileDomId,
			dataType : 'json',
			success : function(data, status) {
				resetFileDom();
				if(data.fileId=="" || data.errorCode=="500"){
					this.error(data, status);
					return;
				}
				if(method) ApCaller.executePage(method, null, jQuery.extend(params,data),successCallback, null, null, "json");
				else successCallback(data);
			},
			error : function(data, status, e) {
				failedCallback(data, status, e);
			}
		});
	}*/
};