import React from 'react';
import { render } from '@testing-library/react-native';
import SkillTag from '../../components/Event/SkillTag';

describe('SkillTag Component', () => {
  it('renders correctly for BEGINNER skill level', () => {
    const { getByText } = render(<SkillTag level="BEGINNER" />);
    const tag = getByText('BEGINNER');

    expect(tag).toBeTruthy();
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#00796b' })
      ])
    );
  });

  it('renders correctly for INTERMEDIATE skill level', () => {
    const { getByText } = render(<SkillTag level="INTERMEDIATE" />);
    const tag = getByText('INTERMEDIATE');

    expect(tag).toBeTruthy();
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#e65100' })
      ])
    );
  });

  it('renders correctly for ADVANCED skill level', () => {
    const { getByText } = render(<SkillTag level="ADVANCED" />);
    const tag = getByText('ADVANCED');

    expect(tag).toBeTruthy();
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#b71c1c' })
      ])
    );
  });

  it('renders correctly for unknown skill level (default case)', () => {
    const { getByText } = render(<SkillTag level="EXPERT" />);
    const tag = getByText('EXPERT');

    expect(tag).toBeTruthy();
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#757575' })
      ])
    );
  });

  it('renders correctly with lowercase input', () => {
    const { getByText } = render(<SkillTag level="beginner" />);
    const tag = getByText('beginner');

    expect(tag).toBeTruthy();
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#00796b' })
      ])
    );
  });

  it('renders correctly with mixed-case input', () => {
    const { getByText } = render(<SkillTag level="AdVaNcEd" />);
    const tag = getByText('AdVaNcEd');

    expect(tag).toBeTruthy();
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#b71c1c' })
      ])
    );
  });

  it('renders with correct default styling', () => {
    const { getByText } = render(<SkillTag level="UNKNOWN" />);
    const tag = getByText('UNKNOWN');

    expect(tag).toBeTruthy();
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#757575' })
      ])
    );
  });

  it('applies correct background color for beginner', () => {
    const { getByText } = render(<SkillTag level="BEGINNER" />);
    const tagContainer = getByText('BEGINNER').parent?.parent;

    expect(tagContainer?.props?.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#e0f7fa' })
      ])
    );
  });

  it('applies correct background color for intermediate', () => {
    const { getByText } = render(<SkillTag level="INTERMEDIATE" />);
    const tagContainer = getByText('INTERMEDIATE').parent?.parent;

    expect(tagContainer?.props?.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#fff3e0' })
      ])
    );
  });

  it('applies correct background color for advanced', () => {
    const { getByText } = render(<SkillTag level="ADVANCED" />);
    const tagContainer = getByText('ADVANCED').parent?.parent;

    expect(tagContainer?.props?.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#ffebee' })
      ])
    );
  });

  it('applies correct background color for unknown skill', () => {
    const { getByText } = render(<SkillTag level="UNKNOWN" />);
    const tagContainer = getByText('UNKNOWN').parent?.parent;

    expect(tagContainer?.props?.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#e0e0e0' })
      ])
    );
  });

  it('renders with capitalized text', () => {
    const { getByText } = render(<SkillTag level="advanced" />);
    const tag = getByText('advanced');
    expect(tag).toBeTruthy();
  });

});
