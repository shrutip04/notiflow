package com.notiflow.backend.decision;

import com.notiflow.backend.entity.Preference;
import org.springframework.stereotype.Component;

@Component
public class InterruptionCostEngine {

    private static final double FOCUS_MODE_BOOST = 0.2;

    public double evaluate(InterruptibilityResult interruptibility, Preference preference) {
        double baseCost = 1.0 - interruptibility.getScore();

        double focusModeBoost = preference.isFocusModeEnabled() ? FOCUS_MODE_BOOST : 0.0;

        return Math.min(baseCost + focusModeBoost, 1.0);
    }
}