/**
 * @name dropImageModule
 * @version 0.0.1
 *
 * Uses classie.js for class manipulation of the DOM elements.
 * Embed classie.js before DropImageModule.js
*/


function DropImage (options) {

	var dragged;

	var defaults = {
		url: '/admin/albums/setCover',
		wrapperId: 'cover-photo',
		wrapperClassName: 'dropAreaImage',
		elementsWithIds: {hotel_id:'hotel_id'},
		elementsWithClasses: {},
		cover_image_id: '#cover_image',
		cover_image_returned_id: '#cover_image_returned',
		cover_image_src: '/assets/images/hotel_covers/'
	}

	var actual = $.extend({}, defaults, options || {});

	function init() {

		cacheDom();
	}

	/**
	 * Cache DOM elements into this function
	 * 
	 * 
	 * @return {module} 
	 */
	function cacheDom () {

		this.wrapper = document.getElementById(actual['wrapperId']);
		this.dropAreaElements = this.wrapper.getElementsByClassName(actual['wrapperClassName']);

		var module = this;

		Array.prototype.forEach.call(this.dropAreaElements, function(el) {

			_bindEvents(module, el.querySelectorAll('.drop-area')[0], el);
		})

		return this;
	};

	/**
	 * Bind all events to cached elements in this function
	 * 
	 * @param module [module with cacheDom() method]
	 */
	function _bindEvents (/*this module context*/ module, element, dropAreaWrapper) {
		
		element.addEventListener('dragenter', function (e){
		  	e.preventDefault();
		  	$(this).css('background', '#BBD5B8');
		});
		element.addEventListener('dragover', function (e){
			e.preventDefault();
		});
		element.addEventListener('drop', function (e){
		  	e.preventDefault();
		  	$(this).css('background', '#D8F9D3');
		  	var image = e.dataTransfer.files;
		  	createFormData(image, element, dropAreaWrapper);
		});
	};

	function createFormData(image, el, dropAreaWrapper) {
	 	var formData = new FormData();
	 	formData.append('userImage', image[0]);
	 	for(var element in actual.elementsWithIds) {
	 		formData.append(element, document.getElementById(actual.elementsWithIds[element]).value);
	 	}
	 	for(var classElement in actual.elementsWithClasses) {
	 		formData.append(classElement, dropAreaWrapper.getElementsByClassName(actual.elementsWithClasses[classElement])[0].value);
	 	}

	 	_uploadFormData(formData, dropAreaWrapper);
	}

	function _uploadFormData(formData, dropAreaWrapper) {

		$(document).on('ajaxStart', function(){
		    dropAreaWrapper.getElementsByClassName('loading-image')[0].style.display = "block";
		});

		$(document).on('ajaxStop', function(){
		    dropAreaWrapper.getElementsByClassName('loading-image')[0].style.display = "none";

		    $(document).unbind('ajaxStart');
   			$(document).unbind('ajaxStop');
		});

	 	$.ajax({
	 		url: actual.url,
	 		type: "POST",
	 		data: formData,
	 		contentType:false,
	 		cache: false,
	 		processData: false,
	 		success: function(data){
	 			var target = dropAreaWrapper;
	 			if(target.getElementsByClassName('room_type')[0]) {
	 				target.getElementsByClassName('room_type')[0].dataset.src = JSON.parse(data);
	 			}
	  			target.getElementsByClassName('cover_image_returned')[0].src = actual['cover_image_src'] + JSON.parse(data);
	 		}
	 	});
	}

	return {
		init: init,
		createFormData: createFormData
	}

};