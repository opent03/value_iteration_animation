function getExampleMDP() {
    let gamma = 0.95;
    let states = ['s0', 's1', 's2'];
    let actions = ['a0', 'a1'];
    let rewards = {
        's0': {},
        's1': {
            'a0': {
            's0': 5
            }
        },
        's2': {
            'a1': {
            's0': -1
            }
        }
    };
    let P = {
        's0': {
            'a0': {
            's0': 0.5,
            's2': 0.5
            },
            'a1': {
            's2': 1.0
            }
        },
        's1': {
            'a0': {
            's0': 0.7,
            's1': 0.1,
            's2': 0.2
            },
            'a1': {
            's1': 0.95,
            's2': 0.05
            }
        },
        's2': {
            'a0': {
            's0': 0.4,
            's2': 0.6
            },
            'a1': {
            's0': 0.3,
            's1': 0.3,
            's2': 0.4
            }
        }
    };
    return new MDP(states, actions, rewards, P, gamma);
}