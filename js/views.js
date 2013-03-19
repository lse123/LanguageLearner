// Views
var NavView = Backbone.View.extend(
{
	initialize: function()
	{
		this.render();
	},
	render: function(){},
	showHeader: function(title) {

		$('#header').find('h1').html(title);
		$('#header').addClass('bounceInLeft');
	},
	hideHeader: function() {

		$('#header').removeClass('bounceInLeft').addClass('bounceOutLeft').hide();
	},
	updateHeader: function(title) {

		$('#header').find('h1').html(title);
		setTimeout(function() {
			$('#header').addClass('bounceOutRight');
		}, 250);

		setTimeout(function() {
			$('#header').find('h1').html(title).removeClass('bounceOutRight').addClass('bounceInLeft');
		}, 500);
	},
	showFooter: function() {

		setTimeout(function() {
			$('#footer').removeClass('bounceOutDown').addClass('bounceInUp');
		}, 250);
	},
	hideFooter: function() {

		$('#footer').removeClass('bounceInUp').addClass('bounceOutDown');
	}
});


var HomeView = Backbone.View.extend(
{
	initialize: function()
	{
		this.render();
	},
	render: function(){},
	showLessons: function()
	{
		// Header
		setTimeout(function() {
			$('#header').find('h1').html('Takk Iceland <img src="images/iceland.svg" height="85">').addClass('bounceInLeft');
		}, 250);

		// Stage - Lessons
		var this_container = this.$el;
		this_container.html('');
		
		setTimeout(function() {
			$.each(AppModel.get('lessons'), function(lesson, settings) {			
				this_container.append(_.template($("#template-lesson").html(), settings));	
			});		
		}, 500);


		// Footer
		setTimeout(function() {
			$('#footer').removeClass('bounceInUp').addClass('bounceOutDown');
		}, 250);
	}
});


var LessonView = Backbone.View.extend(
{
	initialize: function() {
		this.render();		
	},
	render: function() {},
	events: {
		"click #button_play_all": "playAllPhrases"
	},
	build: function() {

		// Header
		$('#header').addClass('bounceOutRight');
		
		setTimeout(function() {
			$('#header').removeClass('bounceOutRight').find('h1').html(LessonModel.get('lesson')).addClass('bounceInLeft');
		}, 250);


		// Stage - Phrases
		var phrases_html = '';

		$.each(LessonModel.get('phrases'), function(key, phrase)
		{
			phrases_html += '<li class="listy animated bounceInLeft"><a href="#' + LessonModel.get('lesson_url') + '/' + key + '" class="play-phrase">' + phrase.native + '</a></li>';
		});

		// Populate HTML		
		$('#stage').html(_.template($("#template-phrases").html(), { phrases: phrases_html }));


		// Footer
		setTimeout(function() {
			$('#footer').removeClass('bounceOutDown').html('<a href="#"><span class="icon-arrow-left-alt1"></span></a> <a href="#" id="button_play_all"><span class="icon-play"></span></a> <a href="#" id="button_pause_all"><span class="icon-pause"></span></a>').addClass('bounceInUp');
		}, 250);

	},
	media: function() {

	}
	playAllPhrases: function(e) {

		e.preventDefault();

		this.media.play();

/*		HTML5 Audio API
		var audio = document.createElement('audio');
		audio.setAttribute('id', 'audio-player');
		audio.setAttribute('src', 'audio/' + LessonModel.get('audio_file'));
		audio.load();
		//audio.currentTime = 1;
		audio.play();

		// Pause on Stop
		audio.addEventListener('timeupdate', function(e)
		{
			if (audio.currentTime > LessonModel.get('intro').end)
			{
				console.log('stop introduction');
				audio.pause();
			}
		}, true);
*/

	},
	mediaSuccess: function() {
		console.log('Inside mediaSuccess yay!!!!');
	},
	mediaError: function() {
		console.log('Inside mediaError yay!!!!');
	},
	mediaStatus: function() {
		console.log('Inside mediaStatus yay!!!!');
	}		
});


var PhraseView = Backbone.View.extend(
{
	initialize: function()
	{
		this.render();
	},
	render: function() {},
	events: {
		"click #button_back"	: "buttonBack",
		"click #button_loop"	: "buttonChangeLoop",
		"click #button_play"	: "buttonPlay",
		"click #button_vol"		: "buttonVolume"
	},
	build: function(id)
	{
		console.log('inside of phrase ' + id + ' at start ' +  LessonModel.get('phrases')[id].start);

		// Header
		$('#header').addClass('bounceOutRight');


		// Stage - Player		
		setTimeout(function() {
		
			// HTML Template
			var phrase_html = {
				foreign		: LessonModel.get('phrases')[id].foreign,
				native		: LessonModel.get('phrases')[id].native,
				lesson_url	: LessonModel.get('lesson_url')
			}
	
			var template = _.template($("#template-player").html(), phrase_html);
			$('#stage').html(template).hide().delay(250).fadeIn();
	
		}, 500);

		var controls_data = {
			lesson_url: LessonModel.get('lesson_url'),
			loop_total: UserModel.get('loop_total')
		}

	    var template_controls = _.template($('#template-player-controls').html(), controls_data);
		$('#footer').html(template_controls).hide().delay(250).fadeIn();



		// Empty Audio Object
		var loop_current = 1;


		// Create Audio Object
		var audio = document.createElement('audio');
		audio.setAttribute('id', 'audio-player');
		audio.setAttribute('src', 'audio/' + LessonModel.get('audio_file'));
		audio.load();
		audio.play();


		// Listener
		audio.addEventListener('timeupdate', function()
		{
			if (audio.currentTime < LessonModel.get('phrases')[id].start) {
				audio.currentTime = LessonModel.get('phrases')[id].start;
				audio.volume=.75;
			}

			if (audio.currentTime > LessonModel.get('phrases')[id].end) {
				if (loop_current < UserModel.get('loop_total')) {
					loop_current++;
					audio.currentTime = LessonModel.get('phrases')[id].start;
					audio.play();
					console.log('update loop_current: ' + loop_current + ' and learn moa');
				}
				else {
					console.log('stop now at: ' + LessonModel.get('phrases')[id].end);
					audio.pause(); 
				}
			}
		}, false);

	},
	buttonBack: function(e) {

		audio.pause();	

		return false;
	},
	buttonChangeLoop: function(e) {
		
		e.preventDefault();
		
		var controls = _.template($('#template-loop-controls').html());
				
		return false;
	},
	buttonPlay: function(e) {

		console.log('inside button play');

		e.preventDefault();

		
		if ($(this).html() === '<span class="icon-pause"></span>') {
			audio.pause();
			$(this).html('<span class="icon-play"></span>');
		}
		else if ($(this).html() === '<span class="icon-play"></span>') {
			audio.play();
			$(this).html('<span class="icon-pause"></span>');
		}
		
		return false;
	},
	buttonVolume: function(e) {
		
		e.preventDefault();
		
		if ($(this).html() === '<span class="icon-volume-high"></span>') {
			audio.volume=.25;
			$(this).html('<span class="icon-volume-medium"></span>');
		}
		else if ($(this).html() === '<span class="icon-volume-medium"></span>') {
			audio.volume=.75;
			$(this).html('<span class="icon-volume-high"></span>');
		}
		
		return false;
	}
});
