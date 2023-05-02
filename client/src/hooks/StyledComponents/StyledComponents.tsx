import styled from "styled-components";

export const StyledImage = styled.div<{ src: string }>`
  background-image: url(${props => props.src});
`;

export const StyledCarousel = styled.div<{ position: string }>`
  transform: translateX(${props => props.position});
`;