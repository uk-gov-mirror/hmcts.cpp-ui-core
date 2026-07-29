import { UserServiceFeature, UserService } from '../users-groups.interfaces';

// This featureExist method has been changed to accommodate legacy userServices therefore
// making the method backwards compatible. The userService[] implementation will be removed
// once we get rid of the old endpoint.

/**@deprecated pass in the UserServiceFeature[] instead. */
export function featuresExist(userServices: UserService[], expectedFeatureKeys: string[]): boolean;
export function featuresExist(
  features: UserServiceFeature[],
  expectedFeatureKeys: string[]
): boolean;
export function featuresExist(
  featureVariants: UserServiceFeature[] | UserService[],
  expectedFeatureKeys: string[]
): boolean {
  let allFeatureKeys: string[] = [];
  if (isUserServices(featureVariants)) {
    allFeatureKeys = featureVariants.reduce(
      (allKeys: string[], service: UserService) =>
        allKeys.concat(service.features.map(({ key }) => key)),
      []
    );
  } else {
    allFeatureKeys = featureVariants.map(({ key }) => key);
  }
  return expectedFeatureKeys.some((efk) => allFeatureKeys.includes(efk));
}

function isUserServices(value: UserService[] | UserServiceFeature[]): value is UserService[] {
  return (value as UserService[]).every((item) => 'features' in item);
}
