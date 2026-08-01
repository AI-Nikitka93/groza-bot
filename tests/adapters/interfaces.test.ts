import { IDataProvider, RawWeatherData } from '../../src/core/interfaces/IDataProvider';
import { INowcastProvider, NowcastResult } from '../../src/core/interfaces/INowcastProvider';
import { IForecastProvider, ForecastResult } from '../../src/core/interfaces/IForecastProvider';
import { INotificationProvider, NotificationPayload } from '../../src/core/interfaces/INotificationProvider';
import { IRuleEngine, RuleContext, RuleDecision } from '../../src/core/interfaces/IRuleEngine';

// Mock Implementations for testing the contracts
class MockDataProvider implements IDataProvider {
  providerName = 'MockData';
  async initialize() {}
  async connect() {}
  async disconnect() {}
  onData(callback: (data: RawWeatherData) => void) {
    callback({
      timestamp: Date.now(),
      location: { latitude: 50, longitude: 30 },
      type: 'mock',
      payload: {}
    });
  }
  async getHealthScore() { return 100; }
}

class MockNowcastProvider implements INowcastProvider {
  providerName = 'MockNowcast';
  async initialize() {}
  async getNowcast(location: any, horizonMinutes: number): Promise<NowcastResult[]> {
    return [{
      timestamp: Date.now() + horizonMinutes * 60000,
      precipIntensity: 5,
      thunderstormProb: 80,
      isExtreme: true,
      confidenceScore: 90,
      explanation: 'High probability based on mock data.'
    }];
  }
  async getHealthScore() { return 100; }
}

class MockRuleEngine implements IRuleEngine {
  async evaluate(context: RuleContext): Promise<RuleDecision> {
    const hasExtremeNowcast = context.nowcast?.some(n => n.isExtreme && n.confidenceScore > 80);
    if (hasExtremeNowcast) {
      return { shouldAlert: true, alertLevel: 'critical', reason: 'Extreme conditions expected with high confidence.' };
    }
    return { shouldAlert: false, alertLevel: 'none', reason: 'Conditions normal.' };
  }
}

describe('Groza V3 Core Interfaces Contracts', () => {
  it('should instantiate MockDataProvider and return health score', async () => {
    const provider: IDataProvider = new MockDataProvider();
    const score = await provider.getHealthScore();
    expect(score).toBe(100);
  });

  it('should test RuleEngine determinism based on Nowcast context', async () => {
    const engine: IRuleEngine = new MockRuleEngine();
    const nowcaster: INowcastProvider = new MockNowcastProvider();
    
    const nowcast = await nowcaster.getNowcast({ latitude: 50, longitude: 30 }, 15);
    const decision = await engine.evaluate({
      userId: 'test_user',
      userSettings: {},
      nowcast: nowcast
    });
    
    expect(decision.shouldAlert).toBe(true);
    expect(decision.alertLevel).toBe('critical');
    expect(decision.reason).toContain('Extreme conditions');
  });
});
