import React, { useState } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Divider,
    Heading,
    Radio, 
    RadioGroup,
    Stack
} from "@chakra-ui/core";

export default (filters) => {

    const [topic, setTopic] = useState("");
    const [language, setLanguage] = useState("");
    const [skillLevel, setSkillLevel] = useState("");

    return (
        <Accordion defaultIndex={[0, 1, 2]} allowMultiple={true}>
            {Object.keys(filters).map((filter, index) => (
                <AccordionItem>
                    <AccordionButton>
                        <Box flex="1" textAlign="left">
                            <Heading as="h4" fontSize="lg" textAlign="left">
                                {filters[filter].title}
                            </Heading>
                            <Divider mt={2}/>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <RadioGroup value={filter}>
                            <Stack>
                                {filters[filter].values.map(val => {
                                    return (
                                    <Radio key={val} value={val}>
                                        {val}
                                    </Radio>
                                    );
                                })}
                            </Stack>
                        </RadioGroup>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
