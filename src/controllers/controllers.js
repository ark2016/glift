goog.provide('glift.controllers');

/**
 * The controllers module provides the logic layer (the "brains") of Go board widgets.
 * 
 * Controllers abstract the complexity of working with rules and move trees directly.
 * You can use movetree and rules directly, but controllers provide a simpler API
 * for common operations. This separation also makes it easier to test logic
 * independently from UI changes.
 * 
 * @namespace
 */
glift.controllers = {};
