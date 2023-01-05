import React from "react";
import Spritesheet from "react-responsive-spritesheet";

import ani from "../../assets/ani.png";
import ani2 from "../../assets/ani2.png";
import ani3 from "../../assets/ani3.png";

const Round = ({ players }) => {

    return (
        <div>
            {players === 2
                ? <Spritesheet
                    image={ani2}
                    widthFrame={344}
                    heightFrame={94}
                    autoplay={false}
                />
                : players === 3
                    ? <Spritesheet
                        image={ani3}
                        widthFrame={344}
                        heightFrame={94}
                        autoplay={false}
                    />
                    : players === 4
                        ? <Spritesheet
                            image={ani}
                            widthFrame={344}
                            heightFrame={94}
                            autoplay={false}
                        />
                        : null}
        </div>
    );
};

export default Round;