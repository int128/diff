/*
 * diff/app.js
 * (c) hidetake.org, 2011-2012.
 */
$(function () {
	$('.result').tooltip({
		selector: 'span.added>span, span.deleted>span'
	});
	$.extend({
		sum: function (array, func) {
			var s = 0;
			$.each(array, function (i, e) {
				s += func(e, i);
			});
			return s;
		}
	});
	var dmp = new diff_match_patch();
	var DiffViewModel = function (newText, oldText) {
		this.newText = ko.observable(newText);
		this.oldText = ko.observable(oldText);
		this.newLength = ko.computed(function () {
			return this.newText().length;
		}, this);
		this.oldLength = ko.computed(function () {
			return this.oldText().length;
		}, this);
		this.differences = ko.computed(function () {
			var positionInNew = 1, positionInOld = 1;
			return $.map(dmp.diff_main(this.oldText(), this.newText()), function (e) {
				var kind = parseInt(e[0]);
				var difference = {
					added: kind == 1,
					equal: kind == 0,
					deleted: kind == -1,
					text: e[1],
					positionInNew: {
						first: positionInNew,
						last: positionInNew + e[1].length - 1
					},
					positionInOld: {
						first: positionInOld,
						last: positionInOld + e[1].length - 1
					}
				};
				if (!difference.added) {
					positionInOld += difference.text.length;
				}
				if (!difference.deleted) {
					positionInNew += difference.text.length;
				}
				return difference;
			});
		}, this);
		this.addedLength = ko.computed(function () {
			return $.sum(this.differences(), function (e) {
				return e.added ? e.text.length : 0;
			});
		}, this);
		this.deletedLength = ko.computed(function () {
			return $.sum(this.differences(), function (e) {
				return e.deleted ? e.text.length : 0;
			});
		}, this);
	};
	ko.applyBindings(new DiffViewModel(
		'１．\n国の行政機関が保有する個人情報の保護については、行政機関個人情報保護法を適切に運用するため、同法の運用の統一性、法適合性を確保する立場にある総務省は、「行政機関の保有する個人情報の適切な管理のための措置に関する指針」（平成１６年９月１４日総務省行政管理局長通知）を策定し、個人情報の適切な管理を徹底してきたところであり、引き続き、各行政機関及び国民に対して、パンフレットの配布や説明会の実施等を行い同法の周知を図るとともに、施行状況の概要の公表等国民に対する情報提供を行い制度の運用の透明性を確保する。',
		'１−１．\n国の行政機関が保有する個人情報の保護については、行政機関個人情報保護法を適切に運用するため、同法の運用の統一性、法適合性を確保する立場にある総務省は、①各行政機関が保有する個人情報の適切な管理に関する指針等を策定するとともに、②各行政機関及び国民に対して、パンフレットの配布や説明会の実施等を行い同法の周知を図り、③施行状況の概要の公表等国民に対する情報提供を行い制度の運用の透明性を確保する。'));
});