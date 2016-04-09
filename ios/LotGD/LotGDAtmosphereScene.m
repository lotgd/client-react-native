//
//  LotGDAtmosphereScene.m
//  LotGD
//
//  Created by Austen McDonald on 1/28/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "LotGDAtmosphereScene.h"

@interface LotGDAtmosphereScene ()

@property BOOL contentCreated;

@end

@implementation LotGDAtmosphereScene

- (void)didMoveToView:(SKView *)view
{
  if (!self.contentCreated)
  {
    self.backgroundColor = [SKColor colorWithRed:184./255 green:184./255 blue:184./255 alpha:1.0];
    self.scaleMode = SKSceneScaleModeResizeFill;
    SKNode *system = [self _particleSystem];
    system.position = CGPointMake(0, 700);
    [self addChild:system];
    self.contentCreated = YES;
  }
}

- (SKNode *)_particleSystem
{
  NSString *path = [[NSBundle mainBundle] pathForResource:@"SnowParticle" ofType:@"sks"];

  return [NSKeyedUnarchiver unarchiveObjectWithFile:path];
  
  SKEmitterNode *emitter = [[SKEmitterNode alloc] init];

  emitter.particleTexture = [SKTexture textureWithImageNamed:@"snow.png"];
  emitter.particlePositionRange = CGVectorMake(5, 915);

  emitter.particleBirthRate = 55;

  emitter.particleSpeed = 80.0;
  emitter.particleSpeedRange = 120.0;

  emitter.particleLifetime = 8.0;
  emitter.particleLifetimeRange = 55;

  emitter.yAcceleration = -74;

  emitter.particleScale = .1;
  emitter.particleScaleRange = .05;

  emitter.particleAlpha = 1.0;
  emitter.particleAlphaRange = .75;
  

  return emitter;
}

@end
