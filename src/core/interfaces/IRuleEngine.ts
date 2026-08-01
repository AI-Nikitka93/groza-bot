import { NowcastResult } from './INowcastProvider';
import { ForecastResult } from './IForecastProvider';

export interface RuleContext {
  userId: string;
  userSettings: any;
  nowcast?: NowcastResult[];
  forecast?: ForecastResult[];
  recentAlerts?: any[];
}

export interface RuleDecision {
  shouldAlert: boolean;
  alertLevel: 'none' | 'info' | 'warning' | 'critical';
  reason: string;
}

export interface IRuleEngine {
  /**
   * Evaluates the context strictly deterministically and decides if an alert should be sent.
   * AI does not make this decision.
   */
  evaluate(context: RuleContext): Promise<RuleDecision>;
}
