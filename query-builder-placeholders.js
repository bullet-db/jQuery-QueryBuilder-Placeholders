/*
 *  Copyright 2016, Yahoo Inc.
 *  Licensed under the terms of the Apache License, Version 2.0.
 *  See the LICENSE file associated with the project for terms.
 */

/*
 * jQuery QueryBuilder Placeholders
 * Allows you to add custom placeholders per type of the filter operation by
 * defining a placeholders object with keys being the type of the operator
 * and value the placeholder string.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'query-builder'], factory);
    }
    else {
        factory(root.jQuery);
    }
}(this, function($) {
    "use strict";

    var QueryBuilder = $.fn.queryBuilder;
    QueryBuilder.prototype = $.fn.queryBuilder.constructor.prototype;

    var originalGetRuleInput = QueryBuilder.prototype.getRuleInput;

    QueryBuilder.define('placeholders', function() { });

    QueryBuilder.extend({
        /*
         * Extend original getRuleInput. If the filter has a custom placeholders object, with placeholders defined
         * for a rule operator type, use those as the filter placeholder instead.
         */
        getRuleInput : function(rule, value_id) {
            var filter = rule.filter;
            if (typeof filter.input !== 'function') {
                switch (filter.input) {
                    case 'radio':
                    case 'checkbox':
                    case 'select':
                        break;
                    default:
                        // textarea and text
                        if (rule.operator && filter.placeholders && filter.placeholders[rule.operator.type]) {
                            var newPlaceholder = filter.placeholders[rule.operator.type];
                            // Save any existing placeholder if not saved before
                            if (filter.placeholder && !filter.placeholderHolder) {
                                filter.placeholderHolder = filter.placeholder;
                            }
                            filter.placeholder = newPlaceholder;
                        } else if (filter.placeholderHolder) {
                            filter.placeholder = filter.placeholderHolder;
                        }
                }
            }
            return originalGetRuleInput.call(this, rule, value_id);
        }
    });
}));
