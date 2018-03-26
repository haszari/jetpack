/*global wp*/

/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
	getWrapperDisplayName
} = wp.element;
const {
	Toolbar
} = wp.components;
const {
	BlockControls
} = wp.blocks;

function filterAddMasonryBlockAttribute( settings, blockTypeName ) {
	if ( blockTypeName === 'core/gallery' ) {
		let blockAttributes = settings.attributes || {};

		blockAttributes = Object.assign( blockAttributes, {
			masonryLayout: {
				type: 'boolean',
				'default': false,
			}
		} );

		settings.attributes = blockAttributes;
	}
	return settings;
}

wp.hooks.addFilter(
	'blocks.registerBlockType',
	'jetpack-module-tiled-gallery/hook-block-register',
	filterAddMasonryBlockAttribute
);

function filterAddMasonryClass( props, blockType, attributes ) {
	if ( blockType.name === 'core/gallery' ) {
		let currentClasses = props.className || '';

		if ( attributes.masonryLayout ) {
			currentClasses += ' jetpack-tiled-gallery';
		}

		props = Object.assign( props, { className: currentClasses } );
	}
	return props;
}

wp.hooks.addFilter(
	'blocks.getSaveContent.extraProps',
	'jetpack-module-tiled-gallery/add-masonry-class',
	filterAddMasonryClass
);

function filterGalleryBlockEdit( EditComponent ) {
	const WrappedBlockEdit = ( props ) => {
		// We're only extending the gallery block
		if ( props.name !== 'core/gallery' ) {
			return <EditComponent key="edit" { ...props } />;
		}

		const { attributes } = props;
		const { masonryLayout } = attributes;

		const toggleMasonryLayout = ( ) => props.setAttributes( { masonryLayout: ! masonryLayout } );

		const toolbarItems = [
			{
				icon: 'layout',
				title: __( 'Tiled Mosaic' ),
				isActive: masonryLayout,
				onClick: toggleMasonryLayout
			}
		];

		const controls = (
			<BlockControls key="extended-gallery-layout">
				<Toolbar controls={ toolbarItems } />
			</BlockControls>
		);

		return [
			<EditComponent key="edit" { ...props } />,
			props.isSelected && (
				controls
			),
		];
	};
	WrappedBlockEdit.displayName = getWrapperDisplayName( EditComponent, 'extended-gallery-layout-tiled' );

	return WrappedBlockEdit;
}

wp.hooks.addFilter(
	'blocks.BlockEdit',
	'jetpack-module-tiled-gallery/hook-block-edit',
	filterGalleryBlockEdit
);
