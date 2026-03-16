using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PdaSystem.API.Models;

[Table("PD_peso")]
public class Product
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("DATA_HORA")]
    public DateTime? DataHora { get; set; }

    [Column("USUARIO")]
    [MaxLength(20)]
    public string? Usuario { get; set; }

    [Column("PRODUTO")]
    [MaxLength(20)]
    public string? Produto { get; set; }

    [Column("PESO_MIN_MENOR")]
    [MaxLength(20)]
    public string? PesoMinMenor { get; set; }

    [Column("PESO_MAX_MENOR")]
    [MaxLength(20)]
    public string? PesoMaxMenor { get; set; }

    [Column("PESO_START_MENOR")]
    [MaxLength(20)]
    public string? PesoStartMenor { get; set; }

    [Column("PESO_MIN_MAIOR")]
    [MaxLength(20)]
    public string? PesoMinMaior { get; set; }

    [Column("PESO_MAX_MAIOR")]
    [MaxLength(20)]
    public string? PesoMaxMaior { get; set; }

    [Column("PESO_START_MAIOR")]
    [MaxLength(20)]
    public string? PesoStartMaior { get; set; }

    [Column("TAMANHO_FONTE")]
    [MaxLength(20)]
    public string? TamanhoFonte { get; set; }

    [Column("REVISAO")]
    public int? Revisao { get; set; }
}