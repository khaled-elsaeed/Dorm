/*!
 * Material Bootstrap Wizard - v1.0.2
 * =========================================================
 * Product Page: https://www.creative-tim.com/product/material-bootstrap-wizard
 * Copyright 2017 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-bootstrap-wizard/blob/master/LICENSE.md)
 * =========================================================
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// Material Bootstrap Wizard Functions

var searchVisible = 0;
var transparent = true;
var mobile_device = false;

$(document).ready(function(){

    $.material.init();

    /*  Activate the tooltips      */
    $('[rel="tooltip"]').tooltip();

    $.validator.addMethod("govtIssuedId", function(value, element) {
        // Validate government ID format (e.g., 8 alphanumeric characters)
        return /^(?:\d{14}|[A-Z]{1}\d{7})$/.test(value);
    }, "Please enter a valid government ID.");

    $.validator.addMethod("universityEmail", function(value, element) {
        return /^[a-zA-Z]+\d{9}@nmu\.edu\.eg$/.test(value);
    }, "Please enter a valid email address 'firstName(followed by)studend id@nmu.edu.eg'.");

    $.validator.addMethod("egyptPhoneNumber", function(value, element) {
        return /^(010|011|012|015)\d{8}$/.test(value);
    }, "Please enter a valid Egyptian phone number");

    $.validator.addMethod("cgpa", function(value, element) {
        // Check if the value is a number between 0 and 4 with up to two decimal places
        return /^(?:0\.\d{1,2}|[1-3](?:\.\d{1,2})?|4(?:\.0{1,2})?)$/.test(value);
    }, "Please enter a valid GPA between 0 and 4 with up to two decimal places");

    $.validator.addMethod("certificateScore", function(value, element) {
        // Check if the value is a number between 0 and 100 with up to two decimal places
        return /^(?:0\.\d{1,2}|100(?:\.0{1,2})?|[1-9]\d(?:\.\d{1,2})?)$/.test(value);
    }, "Please enter a valid Score between 0 and 100 with up to two decimal places");

    $.validator.addMethod("studentId", function(value, element) {
        // Validate government ID format (e.g., 8 alphanumeric characters)
        return /^(?:\d{9})$/.test(value);
    }, "Please enter a valid Student ID.");

    var $validator = $('.wizard-card form').validate({
        rules: {
            firstName: {
                required: true,
                minlength: 3
            },
            middleName: {
                required: true,
                minlength: 3
            },
            lastName: {
                required: true,
                minlength: 3
            },
            govtIssuedId: {
                required: true,
                govtIssuedId: true
            },
            birthDate: {
                required: true,
            },
            nationality: {
                required: true,
            },
            email: {
                required: true,
                universityEmail: true
            },
            gender: {
                required: true,
            },
            governorate: {
                required: true,
            },
            city: {
                required: true,
            },
            street: {
                required: true,
            },
            phonenumber: {
                required: true,
                egyptPhoneNumber: true
            },
            faculty: {
                required: true,
            },
            program: {
                required: true,
            },level: {
                required: true,
            },
            cgpa: {
                required: true,
                cgpa: true
            },
            studentId: {
                required: true,
                studentId: true
            },
            certificateScore: {
                required: true,
                certificateScore: true
            },
            parentFirstName: {
                required: true,
                minlength: 3
            },
            parentLastName: {
                required: true,
                minlength: 3
            },
            parentPhoneNumber: {
                required: true,
                egyptPhoneNumber: true
            },
            parentLocation: {
                required: true
            },
            haveSiblings: {
                required: true,
            },
            oldResident: {
                required: true,
            }
        },
        messages: {
            firstName: {
                required: "Please enter your first name.",
                minlength: "Your first name must be at least 3 characters long."
            },
            middleName: {
                required: "Please enter your middle name.",
                minlength: "Your middle name must be at least 3 characters long."
            },
            lastName: {
                required: "Please enter your last name.",
                minlength: "Your last name must be at least 3 characters long."
            },
            govtIssuedId: {
                required: "Please enter your government ID.",
            },
            gender: {
                required: "Please select your gender."
            },
            birthDate: {
                required: "Please enter your birthDate."
            },
            nationality: {
                required: "Please enter your nationality."
            },
            email: {
                required: "Please enter your email address.",
                universityEmail: "Please enter a valid email address 'firstName(followed by)studend id@nmu.edu.eg'."
            },
            phonenumber: {
                required: "Please enter your phone number.",
                egyptPhoneNumber: "Please enter a valid Egyptian phone number."
            },
            faculty: {
                required: "Please enter your faculty.",
            },
            program: {
                required: "Please enter your program.",
            },level: {
                required: "Please select your level.",
            },
            cgpa: {
                required: "Please enter your CGPA.",
                cgpa: "Please enter a valid GPA between 0 and 4 with up to two decimal places."
            },
            certificateScore: {
                required: "Please enter your certificate score.",
                certificateScore: "Please enter a valid score between 0 and 100 with up to two decimal places."
            },
            parentFirstName: {
                required: "Please enter your parent's first name.",
                minlength: "Your parent's first name must be at least 3 characters long."
            },
            parentLastName: {
                required: "Please enter your parent's last name.",
                minlength: "Your parent's last name must be at least 3 characters long."
            },
            parentPhoneNumber: {
                required: "Please enter your parent's phone number.",
                egyptPhoneNumber: "Please enter a valid Egyptian phone number for your parent."
            },
            parentLocation: {
                required: "Please enter your parent's location."
            },
            haveSiblings: {
                required: "Please indicate whether you have siblings or not.",
            },
            oldResident: {
                required: "Please indicate whether you are an old resident or not.",
            }
        }
    });
    

    // Wizard Initialization
    $('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',

        onNext: function(tab, navigation, index) {
            console.log("Next button clicked. Current index:", index);
            var $valid = $('.wizard-card form').valid();
            if(!$valid) {
                $validator.focusInvalid();
                return false;
            }
        },

        onInit : function(tab, navigation, index){
            //check number of tabs and fill the entire row
            var $total = navigation.find('li').length;
            var $wizard = navigation.closest('.wizard-card');

            $first_li = navigation.find('li:first-child a').html();
            $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
            $('.wizard-card .wizard-navigation').append($moving_div);

            refreshAnimation($wizard, index);

            $('.moving-tab').css('transition','transform 0s');
            console.log("Wizard initialized. Initial index:", index);
        },

        onTabClick : function(tab, navigation, index){
            var $valid = $('.wizard-card form').valid();

            if(!$valid){
                return false;
            } else{
                return true;
            }
        },

        onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;

            var $wizard = navigation.closest('.wizard-card');
            console.log("Tab shown. Index:", index);

            // If it's the last tab then hide the last button and show the finish instead
            if($current >= $total) {
                console.log("$current >= $total", $current >= $total);

                $($wizard).find('.btn-next').hide();
                $($wizard).find('.btn-finish').show();
            } else {
                console.log("$current >= $total", $current >= $total);

                $($wizard).find('.btn-next').show();
                $($wizard).find('.btn-finish').hide();
            }

            button_text = navigation.find('li:nth-child(' + $current + ') a').html();

            setTimeout(function(){
                $('.moving-tab').text(button_text);
            }, 150);

            var checkbox = $('.footer-checkbox');

            if( !index == 0 ){
                $(checkbox).css({
                    'opacity':'0',
                    'visibility':'hidden',
                    'position':'absolute'
                });
            } else {
                $(checkbox).css({
                    'opacity':'1',
                    'visibility':'visible'
                });
            }

            refreshAnimation($wizard, index);
        }
    });


    // Prepare the preview for profile picture
    $("#wizard-picture").change(function(){
        readURL(this);
    });

    $('[data-toggle="wizard-radio"]').click(function(){
        wizard = $(this).closest('.row');
        wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
        $(this).addClass('active');
        $(wizard).find('[type="radio"]').removeAttr('checked');
        $(this).find('[type="radio"]').attr('checked','true');
    });

    $('[data-toggle="wizard-checkbox"]').click(function(){
        if( $(this).hasClass('active')){
            $(this).removeClass('active');
            $(this).find('[type="checkbox"]').removeAttr('checked');
        } else {
            $(this).addClass('active');
            $(this).find('[type="checkbox"]').attr('checked','true');
        }
    });

    $('.set-full-height').css('height', 'auto');

});



 //Function to show image before upload

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$(window).resize(function(){
    $('.wizard-card').each(function(){
        $wizard = $(this);

        index = $wizard.bootstrapWizard('currentIndex');
        refreshAnimation($wizard, index);

        $('.moving-tab').css({
            'transition': 'transform 0s'
        });
    });
});

function refreshAnimation($wizard, index){
    $total = $wizard.find('.nav li').length;
    $li_width = 100/$total;

    total_steps = $wizard.find('.nav li').length;
    move_distance = $wizard.width() / total_steps;
    index_temp = index;
    vertical_level = 0;

    mobile_device = $(document).width() < 600 && $total > 3;

    if(mobile_device){
        move_distance = $wizard.width() / 2;
        index_temp = index % 2;
        $li_width = 50;
    }

    $wizard.find('.nav li').css('width',$li_width + '%');

    step_width = move_distance;
    move_distance = move_distance * index_temp;

    $current = index + 1;

    if($current == 1 || (mobile_device == true && (index % 2 == 0) )){
        move_distance -= 8;
    } else if($current == total_steps || (mobile_device == true && (index % 2 == 1))){
        move_distance += 8;
    }

    if(mobile_device){
        vertical_level = parseInt(index / 2);
        vertical_level = vertical_level * 38;
    }

    $wizard.find('.moving-tab').css('width', step_width);
    $('.moving-tab').css({
        'transform':'translate3d(' + move_distance + 'px, ' + vertical_level +  'px, 0)',
        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

    });
}

materialDesign = {

    checkScrollForTransparentNavbar: debounce(function() {
                if($(document).scrollTop() > 260 ) {
                    if(transparent) {
                        transparent = false;
                        $('.navbar-color-on-scroll').removeClass('navbar-transparent');
                    }
                } else {
                    if( !transparent ) {
                        transparent = true;
                        $('.navbar-color-on-scroll').addClass('navbar-transparent');
                    }
                }
        }, 17)

}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
};
