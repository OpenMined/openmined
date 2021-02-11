// https://gist.github.com/TheThirdRace/0f439acef8d9cb6bf5d7e69c54704086

export enum Sizes {
  main = '(max-width: 320px) 320px, (max-width: 480px) 480px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, 960px',
  full = '(max-width: 320px) 320px, (max-width: 480px) 480px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 960px) 960px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1440px) 1440px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, (max-width: 2560px) 2560px, 3840px'
}

import { chakra, ThemingProps, useStyleConfig } from '@chakra-ui/react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'
import React, { ReactElement } from 'react'

// TODO review props when NextJs is updated so we don't have to defined it here
/**
 * ? Because NextJs typing is preventing auto-suggest for layout, width and height,
 * ? we declare the styles differently in this component and will manage the switch
 * ? to NextJs typings when calling NextJs `next/image` component
 */
type LayoutValue = 'fixed' | 'intrinsic' | 'responsive' | undefined

type LayoutAndSize =
  | {
      layout: 'fill'
    }
  | {
      layout: LayoutValue
      height: number
      width: number
    }

/**
 * Types for the Image component itself
 */
type ImageProps = Pick<
  NextImageProps,
  'className' | 'loading' | 'objectFit' | 'objectPosition' | 'priority' | 'quality' | 'src' | 'unoptimized'
> &
  Pick<Required<NextImageProps>, 'alt'> &
  Pick<ThemingProps, 'variant'> & {
    dimensions?: [number, number]
    layout?: 'fill' | LayoutValue
    sizes?: Sizes // could be a string too, this one is just a way to make it easier
  }

/**
 * Wraps NextJs `next/image` component in Chakra's factory function
 * This is what will allow to use the theme and the styling properties on the component
 */
const ImageWithChakra = chakra(
  ({
    className,
    dimensions = [0, 0],
    layout = 'fill',
    loading,
    objectFit,
    objectPosition,
    priority,
    quality,
    sizes,
    src,
    unoptimized,
    ...nextjsInternals
  }: ImageProps): ReactElement => {
    /**
     * ? As explained earlier, NextJs typing is preventing auto-suggest for layout, width and height
     * ? Here we actually convert our component typing to NextJs typing
     */
    const [width, height] = dimensions

    const layoutAndSize: LayoutAndSize =
      height > 0 || width > 0
        ? {
            height,
            layout: layout === 'fill' ? 'intrinsic' : layout,
            width
          }
        : {
            layout: 'fill'
          }

    return (
      <NextImage
        className={className}
        loading={loading}
        objectFit={objectFit}
        objectPosition={objectPosition}
        priority={priority}
        quality={quality}
        sizes={sizes}
        src={src}
        unoptimized={unoptimized}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...layoutAndSize}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...nextjsInternals}
      />
    )
  }
)

export default ({ variant, ...props }: ImageProps): ReactElement => {
  /**
   * ? This components serves as an interface to pass Chakra's styles
   * ? You can use the theme and/or styling properties (eg. backgroundColor='red.200')
   */
  const styles = useStyleConfig('Image', { variant })
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ImageWithChakra sx={styles} {...props} />
}