//
//  LotGDAtmosphereManager.m
//  LotGD
//
//  Created by Austen McDonald on 1/28/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "LotGDAtmosphereManager.h"

#import "LotGDAtmosphereScene.h"

#import <SpriteKit/SpriteKit.h>

@implementation LotGDAtmosphereManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  SKView *view = [[SKView alloc] initWithFrame:CGRectZero];
  view.backgroundColor = [UIColor clearColor];
  view.allowsTransparency = YES;

  LotGDAtmosphereScene *scene = [[LotGDAtmosphereScene alloc] initWithSize:view.bounds.size];
  [view presentScene:scene];

  return view;
}

@end
