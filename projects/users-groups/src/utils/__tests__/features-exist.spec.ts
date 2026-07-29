import { UserService, UserServiceFeature } from '../../users-groups.interfaces';
import { featuresExist } from '../features-exist';

describe('featuresExist deprecated', () => {
  const userServices = [
    { features: [{ key: 'featureA' }] },
    { features: [{ key: 'featureA' }, { key: 'featureC' }] }
  ] as UserService[];

  it('should return true if one or more of the feature keys are present in the user services', () => {
    expect(featuresExist(userServices, ['featureC'])).toBe(true);
    expect(featuresExist(userServices, ['featureA', 'featureD'])).toBe(true);
    expect(featuresExist(userServices, ['featureA', 'featureB'])).toBe(true);
  });

  it('should return false if none of the feature keys are present in the user services', () => {
    expect(featuresExist(userServices, ['featureD'])).toBe(false);
    expect(featuresExist(userServices, ['featureE', 'featureF'])).toBe(false);
    expect(featuresExist(userServices, [])).toBe(false);
  });
});

describe('featuresExist', () => {
  const features = [
    { key: 'feature1', title: 'feature1', type: 'COMPONENT' },
    { key: 'feature2', title: 'feature2', type: 'COMPONENT' }
  ] as UserServiceFeature[];

  it('should return true if one or more feature keys are present', () => {
    expect(featuresExist(features, ['feature1'])).toBe(true);
    expect(featuresExist(features, ['feature1', 'feature2'])).toBe(true);
  });

  it('should return flase if none of the feature keys are present', () => {
    expect(featuresExist(features, ['feature4'])).toBe(false);
    expect(featuresExist(features, ['feature5', 'feature6'])).toBe(false);
  });
});
